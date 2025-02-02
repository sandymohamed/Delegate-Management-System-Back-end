const db = require('../../config/db.config');

// Add a payment to an invoice
const addPayment = async (invoice_id, store_id, amount) => {
    try {

        const query = `
        INSERT INTO payments (invoice_id, store_id, payment_date, amount)
        VALUES (?, ?, NOW(), ?)
    `;
        const [results] = await db.query(query, [invoice_id, store_id, amount]);
        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        // Update the customer's total_unpaid_invoices
        const updateCustomerQuery = `
   UPDATE customers
   SET total_unpaid_invoices = total_unpaid_invoices - ?
   WHERE id = (
       SELECT customer_id FROM invoices WHERE id = ?
   );
`;
        await db.query(updateCustomerQuery, [amount, invoice_id]);

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};


// Update invoice payment status
const updateInvoicePayment = async (invoice_id, amount) => {
    try {
        const query = `
        UPDATE invoices
        SET total_paid = total_paid + ?, is_paid = (total_after_discount <= total_paid + ?)
        WHERE id = ?
        `;
        const [results] = await db.query(query, [amount, amount, invoice_id]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        // Update the customer's total_unpaid_invoices
        const updateCustomerQuery = `
  UPDATE customers
  SET total_unpaid_invoices = total_unpaid_invoices - ?
  WHERE id = (
      SELECT customer_id FROM invoices WHERE id = ?
  );
`;

        await db.query(updateCustomerQuery, [amount, invoice_id]);

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

module.exports = {
    addPayment,
    updateInvoicePayment
};