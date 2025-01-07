const db = require('../../config/db.config');


// create a new invoice
const createInvoice = async (store_id, agent_id, customer_id, invoice_number, due_date, total_price, discount, total_after_discount) => {
    try {

        const query = `
            INSERT INTO invoices (store_id, agent_id, customer_id, invoice_number, due_date, total_price, discount, total_after_discount)
            VALUES (?, ?, ?, ?, ?, ?, ? ,?)
        `;
        const values = [store_id, agent_id, customer_id, invoice_number, due_date, total_price, discount, total_after_discount];

        const [results] = await db.query(query, values)

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        const invoiceId = results.insertId;
        return invoiceId;

    } catch (error) {
        return error;
    }

};

// Add products to an invoice
const addSales = async (invoice_id, store_id, product_id, quantity, price, total_price, callback) => {
    try {
        const query = `
        INSERT INTO sales (store_id, invoice_id, product_id, quantity, price, total_price)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

        const values = [store_id, invoice_id, product_id, quantity, price, total_price];
        const [results] = await db.query(query, values, callback);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;

    } catch (error) {
        return error;
    }
};

// Get All invoices
const getAllInvoices = async (invoice_id, callback) => {
    try {
        
    const query = `
    SELECT i.* , s.product_id, s.quantity, s.price, s.total_price AS product_total_price
    FROM invoices i 
    LEFT JOIN sales s ON i.id = s.invoice_id
    
    `;

    await db.query(query, [invoice_id], callback);

    
} catch (error) {
    return error;

}
}

// Get invoice details
const getInvoiceDetails = async (invoice_id, callback) => {
    const query = `
    SELECT i.* , s.product_id, s.quantity, s.price, s.total_price AS product_total_price
    FROM invoices i 
    LEFT JOIN sales s ON i.id = s.invoice_id
    WHERE i.id = ?
    `;

    await db.query(query, [invoice_id], callback);
}




module.exports = {
    createInvoice,
    addSales,
    getAllInvoices,
    getInvoiceDetails,
};