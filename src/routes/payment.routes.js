const express = require('express');
const paymentController = require('../controllers/payment.controller');
const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');

const router = express.Router();

router.get('/:invoice_id', checkAuth, paymentController.getInvoicePayments);
router.post('/', checkAuth, paymentController.addPayment);

module.exports = router;