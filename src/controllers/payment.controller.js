const paymentModel = require('../models/payment.model');

// Add a payment to an invoice
const addPayment = (req, res) => {
    const { invoice_id, store_id, amount } = req.body;

    try {
        const paymentData = paymentModel.addPayment(invoice_id, store_id, amount);

        if (!paymentData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        // Update invoice payment status
        const updPaymentData = paymentModel.updateInvoicePayment(invoice_id, amount);
        if (!updPaymentData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });



        res.status(201).json({ success: true, message: 'Payment added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    addPayment
};