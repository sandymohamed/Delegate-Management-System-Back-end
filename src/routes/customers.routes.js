const express = require('express');
const router = express.Router();

const { getAllCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/users.controller');

const hashPII = require('../middlewares/hashPII');;
const unhashPII = require('../middlewares/unhashPII');
const validateStoreId = require('../middlewares/validateStoreId');
const checkAuth = require('../middlewares/check-auth');



router.get('/', checkAuth, getAllCustomers, unhashPII, (req, res) => {
    res.status(200).json({
        success: true,
        data: res.locals.data,
    });
});

router.get('/:id', checkAuth, getCustomerById, unhashPII, (req, res) => {
    res.status(200).json({
        success: true,
        data: res.locals.data,
    });
});
router.post('/', checkAuth, validateStoreId, hashPII, createCustomer);
router.put('/:id', checkAuth, validateStoreId, hashPII, updateCustomer);
router.delete('/:id', checkAuth, deleteCustomer);

module.exports = router;
