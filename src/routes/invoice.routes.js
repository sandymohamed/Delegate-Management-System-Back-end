const express = require('express');
const invoiceController = require('../controllers/invoice.controller');

const router = express.Router();

router.post('/', invoiceController.createInvoice);
router.get('/:invoice_id', invoiceController.getInvoiceDetails);

module.exports = router;