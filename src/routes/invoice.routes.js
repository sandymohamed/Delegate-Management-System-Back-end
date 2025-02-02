const express = require('express');
const invoiceController = require('../controllers/invoice.controller');
const checkAuth = require('../middlewares/check-auth');

const router = express.Router();

router.post('/', checkAuth, invoiceController.createInvoice);
// TODO: update to checkAdmin
router.get('/', checkAuth, invoiceController.getAllInvoicesDetails);
router.get('/:invoice_id', checkAuth, invoiceController.getInvoiceDetails);
// router.get('/agent/:agent_id', checkAuth, invoiceController.getAllInvoicesByAgent);
router.post('/agent/:agent_id', checkAuth, invoiceController.getAllInvoicesByAgent);

// router.get('/agent/:agent_id', checkAuth, invoiceController.getAllInvoicesByAgent);
router.post('/agent/:agent_id', checkAuth, invoiceController.getAllInvoicesByAgent);

router.post('/customer/:customer_id', checkAuth, invoiceController.getAllInvoicesByCustomer);

module.exports = router;