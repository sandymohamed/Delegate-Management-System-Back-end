const Product = require('../models/products.model');

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

        else res.status(404).send('User not found');


    } catch (err) {
        res.status(500).send(err);
    }
};


const createProduct = async (req, res) => {
    try {
        const store_id = req.user.store_id;
        const products = await Product.create(store_id, req.body);
        res.status(201).json({ success: true, message: " created successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
};



const updateProduct = async (req, res) => {

    try {
        const store_id = req.user.store_id;
        const product = await Product.update(req.params.id, req.body, store_id);
        res.status(204).json({ success: true, message: " update successfully" });
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


/**
 * TODO: work on this
 * const handleProductReturn = async (invoice_id, store_id, product_id, return_quantity, user_id, reason = null) => {
    try {
        // ✅ Get Invoice & Product Data
        let invoiceData = await InvoiceModel.getInvoiceDetails(store_id, invoice_id);
        if (!invoiceData || invoiceData.length === 0) {
            return { success: false, error: "Invoice not found!" };
        }
        invoiceData = invoiceData[0];

        let productData = await InvoiceModel.getInvoiceProductDetails(invoice_id, product_id);
        if (!productData || productData.length === 0) {
            return { success: false, error: "Product not found in invoice!" };
        }
        productData = productData[0];

        console.log("Invoice Data:", invoiceData);
        console.log("Product Data:", productData);

        // ✅ Validate Return Quantity
        if (return_quantity <= 0 || return_quantity > productData.quantity) {
            return { success: false, error: "Invalid return quantity!" };
        }

        // ✅ Calculate return value (unit price * quantity returned)
        let return_value = productData.unit_price * return_quantity;

        // ✅ Insert Return Record
        const query = `
            INSERT INTO return_items (invoice_id, store_id, product_id, return_quantity, return_amount, processed_by, reason)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [invoice_id, store_id, product_id, return_quantity, return_value, user_id, reason]);

        if (result.affectedRows === 0) {
            return { success: false, error: "Failed to process return!" };
        }

        // ✅ Update `invoices.returned_amount`
        const updateInvoiceQuery = `
            UPDATE invoices 
            SET returned_amount = returned_amount + ?
            WHERE id = ?
        `;
        await db.query(updateInvoiceQuery, [return_value, invoice_id]);

        // ✅ Update stock (return items to inventory)
        const updateStockQuery = `
            UPDATE products 
            SET stock = stock + ?
            WHERE id = ?
        `;
        await db.query(updateStockQuery, [return_quantity, product_id]);

        console.log(`Return of ${return_quantity} units of Product ID ${product_id} processed successfully!`);
        return { success: true, message: "Product return processed successfully!" };

    } catch (error) {
        console.error(error);
        throw new Error(`Database Error: ${error.message}`);
    }
};
 */

module.exports = { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct };
