const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');
const { getAllCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer } = require('../controllers/customers.controller');

// const hashPII = require('../middlewares/hashPII');
// const unhashPII = require('../middlewares/unhashPII');
const validateStoreId = require('../middlewares/validateStoreId');



// router.get('/', checkAuth, getAllCustomers, unhashPII, (req, res) => {
//     res.json({
//         success: true,
//         data: res.locals.data,
//     });
// });

// router.get('/:id', checkAuth, getCustomerById, unhashPII, (req, res) => {
//     res.json({
//         success: true,
//         data: res.locals.data,
//     });
// });
// router.post('/', checkAuth, validateStoreId, hashPII, createCustomer);

router.post('/create', checkAuth,createCustomer);
router.get('/', checkAuth, getAllCustomers);
router.post('/', checkAuth, getAllCustomers);
router.get('/:id', checkAuth, getCustomerById);
router.put('/:id', checkAuth,updateCustomer);
router.delete('/:id', checkAuthAdmin, deleteCustomer);

module.exports = router;
