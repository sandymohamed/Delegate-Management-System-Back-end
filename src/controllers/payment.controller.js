const paymentModel = require('../models/payment.model');

// Add a payment to an invoice
const addPayment = async (req, res) => {
    const { invoice_id, user_id, amount } = req.body;
    const {store_id} = req.user;
    try {
        const paymentData = await paymentModel.addPayment(invoice_id, store_id, amount, user_id);
        if (!paymentData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        // Update invoice payment status
        const updPaymentData = await paymentModel.updateInvoicePayment(invoice_id, amount);
        if (!updPaymentData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.status(201).json({ success: true, message: 'Payment added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error });
    }
};

// get all payments to an invoice
const getInvoicePayments = async (req, res) => {
    const { invoice_id } = req.params;
    const {store_id} = req.user;

    try {
        const paymentData = await paymentModel.getInvoicePayments(invoice_id, store_id);

        if (!paymentData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.status(201).json({ success: true, data: paymentData });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    addPayment,
    getInvoicePayments,
};