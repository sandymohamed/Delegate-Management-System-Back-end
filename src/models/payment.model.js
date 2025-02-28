const db = require('../../config/db.config');
const InvoiceModel = require('../models/invoice.model');
const CustomerModel = require('../models/customers.model');

// Add a payment to an invoice
// last one:
// const addPayment = async (invoice_id, store_id, amount, user_id) => {
//     try {
//         console.log("invoice_id, store_id, amount, user_id", invoice_id, store_id, amount, user_id);

//         // ✅ Get invoice details
//         let invoiceData = await InvoiceModel.getInvoiceDetails(store_id, invoice_id);
//         if (!invoiceData || invoiceData.length === 0) {
//             return { success: false, error: "Invoice not found!" };
//         }
//         invoiceData = invoiceData[0];

//         console.log("Invoice Data:", invoiceData);

//         // ✅ Case 1: Direct payment if invoice is unpaid & amount covers total unpaid
//         if (!invoiceData.is_paid && Number(amount) <= Number(invoiceData.total_unpaid)) {
//             const query = `
//                 INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
//                 VALUES (?, ?, NOW(), ?, ?)
//             `;
//             const [results] = await db.query(query, [invoice_id, store_id, amount, user_id]);

//             console.log("Payment Query Executed:", query, invoice_id, store_id, amount, user_id);

//             if (results.affectedRows === 0) {
//                 return { success: false, error: "Something went wrong!" };
//             }

//             await updateInvoicePayment(invoice_id, amount);
//             return { success: true, message: "Payment added successfully!" };
//         }

//         // ✅ Case 2: Distribute payment across multiple unpaid invoices
//         let customerData = await CustomerModel.findById(invoiceData.customer_id, store_id);
//         if (!customerData || customerData.length === 0) {
//             return { success: false, error: "Customer not found!" };
//         }
//         customerData = customerData[0];

//         const connection = await db.getConnection();
//         if (!connection) {
//             throw new Error("Database connection failed!");
//         }

//         console.log("Customer Data:", customerData);

//         // ✅ If customer has unpaid invoices, distribute payment
//         if (customerData.total_unpaid_invoices > 0) {
//             const unpaidInvoices = await InvoiceModel.getAllUnpaidInvoicesByCustomer(store_id, customerData.id);

//             console.log("Unpaid Invoices:", unpaidInvoices);
//             if (!unpaidInvoices || unpaidInvoices.length === 0) {
//                 return { success: false, error: "No unpaid invoices found!" };
//             }

//             let remainingAmount = amount;
//             console.log("remainingAmount:", remainingAmount);

//             for (const invoice of unpaidInvoices) {
//                 if (remainingAmount <= 0) break;
//                 console.log("remainingAmount222:", remainingAmount);


//                 const amountToPay = Math.min(invoice.total_unpaid, remainingAmount);

//                 const isPaid = invoice.total_unpaid <= remainingAmount;

//                 console.log(`Paying ${amountToPay} for invoice ${invoice.id}`);
//                 await connection.beginTransaction();
//                 const query = `
//                     INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
//                     VALUES (?, ?, NOW(), ?, ?)
//                 `;
//                 await connection.query(query, [invoice.id, store_id, amountToPay, user_id]);


//                 const updateINVQuery = `
//                 UPDATE invoices SET is_paid = ${isPaid}, total_paid = ${Number(invoice.total_paid) + Number(amountToPay)}  WHERE id = ${invoice.id}`;

//                 console.log("updateINVQuery", updateINVQuery);
//                 const [updateINVResults] = await connection.query(updateINVQuery);

//                 // await updateInvoicePayment(invoice.id, amountToPay);


//                 await connection.commit(); // Commit transaction if all queries succeed
//                 connection.release(); // Release connection
//                 console.log("updateINVResults", updateINVResults);


//                 remainingAmount -= amountToPay;
//             }
//         }

//         return { success: true, message: "Payment added successfully!" };
//     } catch (error) {
//         await connection.rollback();
//         console.log(error);
//         throw new Error(`Database Error: ${error.message}`);
//     }
// };

// const addPayment = async (invoice_id, store_id, amount, user_id) => {
//     try {
//         // get invoice data to check if invoice is paid or not
//         let invoiceData = await InvoiceModel.getInvoiceDetails(store_id, invoice_id);
//         if (!invoiceData) return ({ success: false, error: 'Invoice not found!' });
//         console.log("invoiceData", invoiceData);

//         invoiceData = invoiceData[0];


//         // check if invoice  !is_paid  and if amount is greater than total_unpaid
//         if (!invoiceData.is_paid && invoiceData.total_unpaid <= amount) {
//             const query = `
//                         INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
//                         VALUES (?, ?, NOW(), ?, ?)
//                         `;
//             const [results] = await db.query(query, [invoice_id, store_id, amount, user_id]);

//             console.log("addPayment", query, invoice_id, store_id, amount, user_id);

//             if (results.affectedRows === 0) {
//                 return ({ success: false, error: 'Something went wrong!' });
//             }

//             return results;
//         }

//         // if invoice is paid or amount is greater than total_unpaid_invoices get customer details 
//         let customerData = await CustomerModel.findById(invoiceData.customer_id, store_id);
//         if (!customerData) return ({ success: false, error: 'Invoice not found!' });
//         customerData = customerData[0];
//         console.log("customerData", customerData);

//         // then check if customer.total_unpaid_invoices is greater than 0
//         if (customerData.total_unpaid_invoices > 0) {
//             console.log("customerData.total_unpaid_invoices", customerData.total_unpaid_invoices);

//             // if true then get invoices where customer_id = customer_id and status = 'unpaid' and total_unpaid > 0 order by total_unpaid desc
//             const unPaidInvoices = await InvoiceModel.getAllUnpaidInvoicesByCustomer(store_id, customerData.id);
//             console.log("unPaidInvoices", unPaidInvoices);
//             if (!unPaidInvoices) return ({ success: false, error: 'Something went wrong!' });

//             let currentAmount = amount;
//             //  then map through the invoices and update the total_unpaid_invoices of the customer
//             unPaidInvoices?.map(async (invoice) => {
//                 console.log("invoice", invoice);
//                 let amountToPay;
//                 if (currentAmount >= invoice.total_unpaid) {
//                     amountToPay = currentAmount - invoice.total_unpaid;
//                 } else {
//                     amountToPay = currentAmount;
//                 }

//                 console.log("currentAmount", currentAmount);
//                 console.log("amountToPay", amountToPay);

//                 if (amountToPay > 0) {
//                     // update the total_unpaid_invoices of the customer
//                     const query = `
//                         INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
//                         VALUES (?, ?, NOW(), ?, ?)
//                             `;      
//                    await db.query(query, [invoice.id, store_id, amountToPay, user_id]);
//                 }
//             });
//         }

// return 'Payment added successfully!';

//     } catch (error) {
//         console.log(error);

//         throw new Error(`Database Error: ${error.message}`);
//     }
// };
// const addPayment = async (invoice_id, store_id, amount, user_id) => {
//     try {
//         // get invoice data to check if invoice is paid or not
//         const invoiceData = await getInvoiceData(invoice_id);
//         if (!invoiceData) return ({ success: false, error: 'Invoice not found!' });

//         // check if invoice is paid or not and if amount is greater than total_unpaid_invoices

//         // if invoice is paid or amount is greater than total_unpaid_invoices get customer details 
//         // then check if customer.total_unpaid_invoices is greater than 0
//         // if true then get invoices where customer_id = customer_id and status = 'unpaid' and total_unpaid > 0 order by total_unpaid desc
//         //  then map through the invoices and update the total_unpaid_invoices of the customer

//         const query = `
//         INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
//         VALUES (?, ?, NOW(), ?, ?)
//     `;
//         const [results] = await db.query(query, [invoice_id, store_id, amount, user_id]);

//         console.log("addPayment", query, invoice_id, store_id, amount, user_id);

//         if (results.affectedRows === 0) {
//             return ({ success: false, error: 'Something went wrong!' });
//         }

//         // // 🔴 🔴 Prevent Double Reduction of total_unpaid_invoices 🔴 🔴
//         // const checkInvoiceQuery = `
//         // SELECT total_after_discount, total_paid FROM invoices WHERE id = ?;
//         // `;
//         // const [invoice] = await db.query(checkInvoiceQuery, [invoice_id]);

//         // if (invoice.total_after_discount > invoice.total_paid) {
//         //     const updateCustomerQuery = `
//         //     UPDATE customers
//         //     SET total_unpaid_invoices = total_unpaid_invoices - ?
//         //     WHERE id = (SELECT customer_id FROM invoices WHERE id = ?);
//         //     `;
//         //     await db.query(updateCustomerQuery, [amount, invoice_id]);
//         // }
//         // console.log("addPayment22222", updateCustomerQuery, amount, invoice_id);

//         return results;
//     } catch (error) {
//         throw new Error(`Database Error: ${error.message}`);
//     }
// };



// Update invoice payment status



const addPayment = async (invoice_id, store_id, amount, user_id) => {
    const connection = await db.getConnection();
    await connection.beginTransaction(); // Start transaction

    try {

        // ✅ Fetch invoice & customer details concurrently
        const [invoiceData, customerData] = await Promise.all([
            InvoiceModel.getInvoiceDetails(store_id, invoice_id),
            CustomerModel.findByInvoiceId(invoice_id, store_id)
        ]);

        if (!invoiceData || invoiceData.length === 0) throw new Error("Invoice not found!");
        if (!customerData || customerData.length === 0) throw new Error("Customer not found!");

        const invoice = invoiceData[0];
        const customer = customerData[0];

        // ✅ Direct Payment Case
        if (!invoice.is_paid && Number(amount) <= Number(invoice.total_unpaid)) {
            const paymentQuery = `
                INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
                VALUES (?, ?, NOW(), ?, ?)
            `;
            const [paymentResult] = await connection.query(paymentQuery, [invoice_id, store_id, amount, user_id]);

            if (paymentResult.affectedRows === 0) throw new Error("Payment failed!");

            await updateInvoicePayment(invoice_id, amount, connection);

            await connection.commit();
            connection.release();
            return { success: true, message: "Payment added successfully!" };
        }

        // ✅ Distribute Payment Across Unpaid Invoices
        const unpaidInvoices = await InvoiceModel.getAllUnpaidInvoicesByCustomer(store_id, customer.id);
        // if (!unpaidInvoices || unpaidInvoices.length === 0) throw new Error("No unpaid invoices found!");

        let remainingAmount = amount;
        let paymentQueries = [];
        let updateQueries = [];

        if (unpaidInvoices.length) {
            for (const invoice of unpaidInvoices) {
                if (remainingAmount <= 0) break;

                const amountToPay = Math.min(invoice.total_unpaid, remainingAmount);
                // const isPaid = invoice.total_unpaid <= remainingAmount;

                // Batch insert payments
                paymentQueries.push(connection.query(`
                INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
                VALUES (?, ?, NOW(), ?, ?)
            `, [invoice.id, store_id, amountToPay, user_id]));

                // Batch update invoices
                updateQueries.push(updateInvoicePayment(invoice.id, amountToPay, connection));

                remainingAmount -= amountToPay;
            }

            // ✅ Execute all queries in parallel for better performance
            await Promise.all([...paymentQueries, ...updateQueries]);
        }

        if (remainingAmount > 0) {
            // throw new Error("Insufficient payment amount!");
            connection.query(`
                UPDATE  customers SET total_unpaid_invoices = total_unpaid_invoices - ? WHERE id = ?
            `, [remainingAmount, customer.id]);
        }
        await connection.commit();
        connection.release();
        return { success: true, message: "Payment added successfully!" };

    } catch (error) {
        await connection.rollback();
        connection.release();
        throw new Error(`Database Error: ${error.message}`);
    }
};
const addPaymentForCustomer = async (customer_id, store_id, amount, user_id) => {
    const connection = await db.getConnection();
    await connection.beginTransaction(); // Start transaction

    try {
        // ✅ Distribute Payment Across Unpaid Invoices
        const unpaidInvoices = await InvoiceModel.getAllUnpaidInvoicesByCustomer(store_id, customer_id);

        let remainingAmount = amount;
        let paymentQueries = [];
        let updateQueries = [];

        if (unpaidInvoices.length) {
            for (const invoice of unpaidInvoices) {
                if (remainingAmount <= 0) break;

                const amountToPay = Math.min(invoice.total_unpaid, remainingAmount);

                // Batch insert payments
                paymentQueries.push(connection.query(`
                INSERT INTO payments (invoice_id, store_id, payment_date, amount, user_id)
                VALUES (?, ?, NOW(), ?, ?)
            `, [invoice.id, store_id, amountToPay, user_id]));

                // Batch update invoices
                updateQueries.push(updateInvoicePayment(invoice.id, amountToPay, connection));

                remainingAmount -= amountToPay;
            }

            // ✅ Execute all queries in parallel for better performance
            await Promise.all([...paymentQueries, ...updateQueries]);
        }

        if (remainingAmount > 0) {
            // throw new Error("Insufficient payment amount!");
            connection.query(`
                UPDATE  customers SET total_unpaid_invoices = total_unpaid_invoices - ? WHERE id = ?
            `, [remainingAmount, customer_id]);
        }
        await connection.commit();
        connection.release();
        return { success: true, message: "Payment added successfully!" };

    } catch (error) {
        await connection.rollback();
        connection.release();
        throw new Error(`Database Error: ${error.message}`);
    }
};

// last one:
// const updateInvoicePayment = async (invoice_id, amount) => {
//     try {
//         const query = `
//         UPDATE invoices
//         SET total_paid = total_paid + ?, is_paid = (total_after_discount <= total_paid + ?)
//         WHERE id = ?
//         `;
//         const [results] = await db.query(query, [amount, amount, invoice_id]);

//         if (results.affectedRows === 0) {
//             return ({ success: false, error: 'Something went wrong!' });
//         }

//         return results;
//     } catch (error) {
//         throw new Error(`Database Error: ${error.message}`);
//     }
// };

const updateInvoicePayment = async (invoice_id, amount, connection) => {
    try {
        const query = `
        UPDATE invoices
        SET total_paid = total_paid + ?, is_paid = (total_after_discount <= total_paid + ?)
        WHERE id = ?
        `;
        const [results] = await connection.query(query, [amount, amount, invoice_id]);

        if (results.affectedRows === 0) {
            return { success: false, error: 'Something went wrong!' };
        }

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

// get all payments to an invoice
const getInvoicePayments = async (invoice_id, store_id) => {
    try {

        const query = `
        SELECT 
            p.*, 
            u.name AS user_name 
        FROM payments p 
        LEFT JOIN users u 
        ON p.user_id = u.id
        WHERE p.invoice_id = ? AND p.store_id = ?
        `;
        const [results] = await db.query(query, [invoice_id, store_id]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};



module.exports = {
    addPayment,
    updateInvoicePayment,
    getInvoicePayments,
    addPaymentForCustomer,
};