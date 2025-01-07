const invoiceModel = require('../models/invoice.model');

// Create a new invoice
const createInvoice = async (req, res) => {
    const { store_id, agent_id, customer_id, invoice_number, due_date = new Date(), discount, products } = req.body;

    // Calculate total price
    let total_price = products?.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    let total_after_discount = total_price - discount;
    try {
        // Create the invoice
        const invoice_id = await invoiceModel.createInvoice(store_id, agent_id, customer_id, invoice_number, due_date, total_price, discount, total_after_discount)

        if (!invoice_id) return res.status(500).json({ success: false, error: "something went wrong!" });
        // Add products to the invoice
        const salesQueries = products.map(product => {
            const total_price = product.quantity * product.price;
            const salesData = invoiceModel.addSales(invoice_id, store_id, product.product_id, product.quantity, product.price, total_price)

            if (!salesData) return res.status(500).json({ success: false, error: salesData });
        });

        // TODO: Add payment details
        res.json({ success: true, message: 'Invoice created successfully', invoice_id });


    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get invoice details
const getInvoiceDetails = (req, res) => {
    const { invoice_id } = req.params;
    try {
        invoiceModel.getInvoiceDetails(invoice_id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createInvoice,
    getInvoiceDetails
};