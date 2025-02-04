const { hashPassword } = require('../middlewares/encryption');
const Product = require('../models/products.model');



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
            error: "Failed to fetch products. Please try again later, error.message"
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
        req.body.password = hashPassword(req.body.password);
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

module.exports = { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct };
