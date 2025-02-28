const { off } = require('pdfkit');
const invoiceModel = require('../models/invoice.model');
const dailyInventoryModel = require('../models/dailyInventory.model');

// Create a new invoice
const createInvoice = async (req, res) => {

    const { store_id, id, } = req.user;

    const { customer_id, invoice_number, due_date = new Date(), discount, products, van_id } = req.body;

    if(!customer_id) return res.status(400).json({ success: false, error: "Customer ID is required" });
    if(!products.length) return res.status(400).json({ success: false, error: "Products are required" });
    console.log("products", products);
    
    // Calculate total price
    let total_price = products?.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    let total_after_discount = total_price - discount;
    try {
        // Create the invoice
        const invoice_id = await invoiceModel.createInvoice(store_id, id, customer_id, invoice_number, due_date, total_price, discount, total_after_discount)

        if (!invoice_id) return res.status(500).json({ success: false, error: "something went wrong!" });
        // Add products to the invoice
       await products.map(product => {
            const salesData = invoiceModel.addSales(invoice_id, store_id, product.product_id, product.quantity, product.price)           
            if (!salesData) return res.status(500).json({ success: false, error: salesData });
        });

        products.forEach(async (product) => {
            product.quantity = product.quantity * -1;
        })
      date  = new Date().toISOString().split('T')[0];
              await dailyInventoryModel.addDailyInventory(van_id, products, date, id);
       
        
        // TODO: Add payment details
        res.json({ success: true, message: 'Invoice created successfully', invoice_id });


    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get All invoice details
const getAllInvoicesDetails = async (req, res) => {
    const { store_id } = req.user;
    try {
        const rows = await invoiceModel.getAllInvoices(store_id);
        res.json({
            success: true,
            data: rows
        })

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


// Get All invoice details By Agent
const getAllInvoicesByAgent = async (req, res) => {
    const { store_id } = req.user;
    const { agent_id } = req.params;

    const { searchTerm, limit, page } = req.body;
    try {
        const rows = await invoiceModel.getAllInvoicesByAgent(store_id, agent_id, searchTerm, limit, page);
        res.json({
            success: true,
            result: rows
        })

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Get All invoice details By Customer
const getAllInvoicesByCustomer = async (req, res) => {
    const { store_id } = req.user;
    const { customer_id } = req.params;
    const { limit, page } = req.body;
    try {
        const rows = await invoiceModel.getAllInvoicesByCustomer(store_id, customer_id, limit, page);
        res.json(rows)

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};


// Get invoice details
const getInvoiceDetails = async (req, res) => {
    const { store_id } = req.user;

    const { invoice_id } = req.params;
    if (!invoice_id) return res.status(400).json({ success: false, error: "Invoice ID is required" });
    try {
        const rows = await invoiceModel.getInvoiceDetails(store_id, invoice_id);

        res.json({
            success: true,
            data: rows
        })
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createInvoice,
    getAllInvoicesDetails,
    getInvoiceDetails,
    getAllInvoicesByAgent,
    getAllInvoicesByCustomer,
};