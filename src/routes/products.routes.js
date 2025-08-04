const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, getProductById, updateProduct, deleteProduct, handleMultiProductsReturn, handleProductReturn, getReturnedProducts } = require('../controllers/products.controller');

const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
const checkAuth = require('../middlewares/check-auth');

// const checkAuthAdmin = require('../middlewares/check-auth-admin');


router.post('/create', checkAuth, createProduct);
router.post('/', checkAuth, getAllProducts);
router.get('/', checkAuth, getAllProducts);
router.get('/:id', checkAuth, getProductById);
router.put('/:id', checkAuth, validateStoreId, updateProduct);
router.delete('/:id', checkAuth, deleteProduct);
router.post('/return', checkAuth, handleProductReturn);
router.post('/returns', checkAuth, handleMultiProductsReturn);
router.post('/returns/products', checkAuth, getReturnedProducts);

module.exports = router;

