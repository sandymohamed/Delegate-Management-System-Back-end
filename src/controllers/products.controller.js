const Product = require('../models/products.model');
const InvoiceModel = require('../models/invoice.model');
const db = require('../../config/db.config');

// TODO: products stock doesn't update in create invoice 

const getAllProducts = async (req, res) => {
    try {
        const store_id = req.user.store_id;

        const { searchTerm, limit, page } = req.body;
        const products = await Product.findAll(store_id, searchTerm, limit, page);
        res.json({ success: true, data: products, });

    } catch (error) {
        console.error("[ERROR] Failed to fetch products:", error.message);

        res.status(500).json({
            success: false,
            error: "Failed to fetch products. Please try again later."
        });
    }
};

const getProductById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const store_id = req.user.store_id;
        const product = await Product.findById(id, store_id);

        if (product) {
            // res.locals.data = product;
            // next();
            res.json({ success: true, data: product, });
        }

        else res.status(404).send('Product not found');


    } catch (err) {
        res.status(500).send(err);
    }
};


const createProduct = async (req, res) => {
    try {
        const store_id = req.user.store_id;
        await Product.create(store_id, req.body);
        res.status(201).json({ success: true, message: "Product created successfully" });
    } catch (err) {
        console.log("[ERROR] Failed to create product:", err.message);
        res.status(500).send(err);
    }
};



const updateProduct = async (req, res) => {

    try {
        const store_id = req.user.store_id;
        await Product.update(req.params.id, req.body, store_id);
        res.status(204).json({ success: true, message: "Product updated successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const store_id = req.user.store_id;

        const result = await Product.deleteById(req.params.id, store_id);
        res.status(204).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
};



const handleProductReturn = async (req, res) => {

    const {
        invoice_id,
        product_id,
        return_quantity,
        reason = null
    } = req.body;

    const {
        store_id,
        id: user_id,
    } = req.user;
    try {
        // ✅ Get Invoice & Product Data
        let invoiceData = await InvoiceModel.getInvoiceDetails(store_id, invoice_id);
        if (!invoiceData || invoiceData.length === 0) {
            return { success: false, error: "Invoice not found!" };
        }
        invoiceData = invoiceData[0];

        console.log("invoiceData", invoiceData);

        let productData = await InvoiceModel.getInvoiceProductDetails(store_id, invoice_id, product_id);
        if (!productData || productData.length === 0) {
            return { success: false, error: "Product not found in invoice!" };
        }
        productData = productData[0];

        // ✅ Validate Return Quantity
        if (return_quantity <= 0 || return_quantity > productData.quantity) {
            return { success: false, error: "Invalid return quantity!" };
        }

        // ✅ Calculate return value (unit price * quantity returned)
        let return_value = productData.price * return_quantity;

        console.log("return_value", return_value)
        // ✅ Insert Return Record
        const query = `
        INSERT INTO return_items (invoice_id, store_id, product_id, return_quantity, return_amount, agent_id, reason)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [invoice_id, store_id, product_id, return_quantity, return_value, user_id, reason]);
        console.log("result", result)

        if (result.affectedRows === 0) {
            return { success: false, error: "Failed to process return!" };
        }

        // ✅ Update stock (return items to inventory)
        const updateStockQuery = `
            UPDATE products 
            SET stock_quantity = stock_quantity + ?
            WHERE id = ?
        `;
        await db.query(updateStockQuery, [return_quantity, product_id]);

        res.send({ success: true, message: "Product return processed successfully!" });

    } catch (error) {
        console.error(error);
        throw new Error(`Database Error: ${error.message}`);
    }
};

const handleMultiProductsReturn = async (req, res) => {
    console.log("req.user", req.user);
    
    try {
        const { store_id, id: user_id } = req.user;
        const returnItems = req.body; // Expecting an array of return items

        // Validate input: Ensure it's an array
        if (!Array.isArray(returnItems) || returnItems.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Invalid request format. Expected an array of return items.",
            });
        }

        // Loop through each return item
        for (const item of returnItems) {
            const { invoice_id, product_id, return_quantity, reason = null } = item;

            // ✅ Check if invoice exists
            let invoiceData = await InvoiceModel.getInvoiceDetails(store_id, invoice_id);
            if (!invoiceData || invoiceData.length === 0) {
                return res.status(400).json({ success: false, error: `Invoice ID ${invoice_id} not found!` });
            }
            console.log("store_id, invoice_id, product_id", store_id, invoice_id, product_id);
            

            let productData = await InvoiceModel.getInvoiceProductDetails(store_id, invoice_id, product_id);
            console.log(`DEBUG: productData for product_id ${product_id} ->`, productData);
            
            if (!productData || !Array.isArray(productData) || productData.length === 0) {
                return res.status(400).json({ success: false, error: `Product ID ${product_id} not found in invoice ${invoice_id}!` });
            }
            
            productData = productData[0];  // ✅ Now we ensure `productData` exists
            
            // ✅ Check if `quantity` exists before using it
            if (!("quantity" in productData)) { 
                return res.status(400).json({ success: false, error: `Invalid product data: missing quantity for product ID ${product_id}!` });
            }

            // ✅ Calculate return value
            let return_value = productData.price * return_quantity;

            // ✅ Insert return record
            const query = `
                INSERT INTO return_items (invoice_id, store_id, product_id, return_quantity, return_amount, agent_id, reason)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(query, [invoice_id, store_id, product_id, return_quantity, return_value, user_id, reason]);

            if (result.affectedRows === 0) {
                return res.status(500).json({ success: false, error: "Failed to process return!" });
            }

            // ✅ Update stock (return items to inventory)
            const updateStockQuery = `
                UPDATE products 
                SET stock_quantity = stock_quantity + ?
                WHERE id = ?
            `;
            await db.query(updateStockQuery, [return_quantity, product_id]);
        }

        res.json({ success: true, message: "All product returns processed successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: `Database Error: ${error.message}` });
    }
};

module.exports = { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, handleProductReturn, handleMultiProductsReturn };
