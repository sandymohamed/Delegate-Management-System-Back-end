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
                
        if (!invoice_number) {
            const invoiceNumberQuery = `
            UPDATE invoices
            SET invoice_number = ?
            WHERE id = ?;
            `;
            await db.query(invoiceNumberQuery, [invoiceId, invoiceId]);
        }
        
    return invoiceId;

    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);

    }

};

// Add products to an invoice
const addSales = async (invoice_id, store_id, product_id, quantity, price) => {
    try {
        const query = `
        INSERT INTO sales (store_id, invoice_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?, ?)
    `;

        const values = [store_id, invoice_id, product_id, quantity, price];
        const [results] = await db.query(query, values);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;

    } catch (error) {
        await db.query(`Delete from invoices where id = ${invoice_id}`);
        throw new Error(`Database Error: ${error.message}`);

    }
};

// Get All invoices
const getAllInvoices = async (store_id) => {
    try {

        const query =
            `SELECT 
    i.id, i.store_id, i.agent_id, i.customer_id, i.invoice_number, 
    i.invoice_date, i.due_date, i.total_price, i.discount, 
    i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
    COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price
            )
        ), JSON_ARRAY()
    ) AS products
FROM invoices i
LEFT JOIN sales s ON (i.id = s.invoice_id AND i.store_id = ?)
GROUP BY i.id;`;

        const [results] = await db.query(query, [store_id]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}
// // get all agent invoices
// const getAllInvoicesByAgent = async (store_id, agent_id, searchTerm, limit) => {

//     limit = limit ? limit : 100;
//     try {
//         const searchTermQuery = searchTerm ? `AND (i.invoice_number LIKE ${searchTerm?.invoice_number} OR
//          i.customer_id LIKE ${searchTerm?.customer_id} OR
//          i.agent_id LIKE ${searchTerm?.agent_id} OR
//          i.invoice_date LIKE ${searchTerm?.invoice_date} OR 
//          i.due_date LIKE ${searchTerm?.due_date} OR
//          i.total_price LIKE ${searchTerm?.total_price} OR
//          i.discount LIKE ${searchTerm?.discount}  OR
//          i.total_after_discount LIKE ${searchTerm?.total_after_discount}  OR 
//          i.is_paid LIKE ${searchTerm?.is_paid}  OR
//          i.total_paid LIKE ${searchTerm?.total_paid} OR
//          i.total_unpaid LIKE ${searchTerm?.total_unpaid} )` : '';


//         const query =
//             `SELECT 
//     i.id, i.store_id, i.agent_id, i.customer_id, i.invoice_number, 
//     i.invoice_date, i.due_date, i.total_price, i.discount, 
//     i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
//     COALESCE(
//         JSON_ARRAYAGG(
//             JSON_OBJECT(
//                 'product_id', s.product_id,
//                 'quantity', s.quantity,
//                 'price', s.price,
//                 'product_total_price', s.total_price
//             )
//         ), JSON_ARRAY()
//     ) AS products
// FROM invoices i 

// LEFT JOIN sales s ON (i.id = s.invoice_id )
// Where ( i.store_id = ${store_id} AND i.agent_id = ${agent_id}  ${searchTermQuery})
// GROUP BY i.id
// LIMIT ${limit}
// ;`;
//         console.log("query", query);

//         const [results] = await db.query(query);

//         if (results.affectedRows === 0) {
//             return ({ success: false, error: 'Something went wrong!' });
//         }

//         return results;
//     } catch (error) {
//         throw new Error(`Database Error: ${error.message}`);
//     }
// }

const getAllInvoicesByAgent = async (store_id, agent_id, searchTerm = "", limit = 100, page = 1) => {
    try {
        limit = parseInt(limit) || 100; // Default limit
        const offset = (parseInt(page) - 1) * limit; // Calculate offset for pagination

        // Construct search query
        const searchTermQuery = searchTerm
            ? `AND (i.invoice_number LIKE ? OR
                    i.customer_id LIKE ? OR
                    i.agent_id LIKE ? OR
                    i.invoice_date LIKE ? OR
                    i.due_date LIKE ? OR
                    i.total_price LIKE ? OR
                    i.discount LIKE ? OR
                    i.total_after_discount LIKE ? OR
                    i.is_paid LIKE ? OR
                    i.total_paid LIKE ? OR
                    i.total_unpaid LIKE ?)`
            : "";

        // SQL query to get paginated data
        const dataQuery = `
            SELECT 
                i.id, i.store_id, i.agent_id, i.customer_id, i.invoice_number, 
                i.invoice_date, i.due_date, i.total_price, i.discount, 
                i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
                COALESCE(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'product_id', s.product_id,
                            'quantity', s.quantity,
                            'price', s.price,
                            'product_total_price', s.total_price
                        )
                    ), JSON_ARRAY()
                ) AS products
            FROM invoices i 
            LEFT JOIN sales s ON i.id = s.invoice_id
            WHERE i.store_id = ? AND i.agent_id = ? ${searchTermQuery}
            GROUP BY i.id
            LIMIT ? OFFSET ?;
        `;

        // SQL query to get total count without pagination
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM invoices i
            WHERE i.store_id = ? AND i.agent_id = ? ${searchTermQuery};
        `;

        // Prepare search term values
        const searchValues = searchTerm ? Array(11).fill(`%${searchTerm}%`) : [];

        // Execute queries
        const [results] = await db.query(dataQuery, [store_id, agent_id, ...searchValues, limit, offset]);
        const [countResult] = await db.query(countQuery, [store_id, agent_id, ...searchValues]);

        return {
            success: true,
            total: countResult[0].total, // Total records count
            limit,
            page,
            data: results, // Paginated invoices
        };
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};


// get all invoices By customer
const getAllInvoicesByCustomer = async (store_id, customer_id, limit = 100, page = 1) => {
    try {
        limit = parseInt(limit) || 100;
        const offset = (parseInt(page) - 1) * limit;

        const query =
            `SELECT 
    i.id, i.store_id, i.agent_id, i.customer_id, i.invoice_number, 
    i.invoice_date, i.due_date, i.total_price, i.discount, 
    i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
    COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price
            )
        ), JSON_ARRAY()
    ) AS products
FROM invoices i 

LEFT JOIN sales s ON (i.id = s.invoice_id )
Where ( i.store_id = ? AND i.customer_id = ?)
GROUP BY i.id
LIMIT ? OFFSET ?
;`;
        const [results] = await db.query(query, [store_id, customer_id, limit, offset]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }
        const countQuery =
            `SELECT Count (*) AS total FROM invoices i 
Where ( i.store_id = ? AND i.customer_id = ?);`;
        const [countResults] = await db.query(countQuery, [store_id, customer_id, limit, offset]);

        console.log("countResults", countResults);

        return {
            success: true,
            total: countResults[0].total,
            limit,
            page,
            data: results,
        };

    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}
// get all unpaid invoices By customer
const getAllUnpaidInvoicesByCustomer = async (store_id, customer_id) => {
    try {
        const query =
            `SELECT 
    i.id, i.store_id, i.agent_id, i.customer_id, i.invoice_number, 
    i.invoice_date, i.due_date, i.total_price, i.discount, 
    i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
    COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price
            )
        ), JSON_ARRAY()
    ) AS products
FROM invoices i 
LEFT JOIN sales s ON (i.id = s.invoice_id )
Where ( i.store_id = ? AND i.customer_id = ? AND i.is_paid = 0)
GROUP BY i.id
ORDER BY i.total_unpaid ASC
;`;
        const [results] = await db.query(query, [store_id, customer_id]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;

    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

// Get invoice details
const getInvoiceDetails = async (store_id, invoice_id) => {
    try {
        const query = `
    SELECT i.* ,
        c.name AS customer_name,
     c.customer_store_name,
     c.phone AS customer_phone,
     c.location AS customer_location,
     c.total_unpaid_invoices AS customer_total_unpaid_invoices,
    COALESCE(
        JSON_ARRAYAGG(
            JSON_OBJECT(
            'product_id', s.product_id,
            'quantity', s.quantity,
            'price', s.price,
            'product_total_price', s.total_price,
            'product_name', p.name
            )
        ), JSON_ARRAY()
    ) AS products
    FROM invoices i 
    LEFT JOIN sales s ON i.id = s.invoice_id
    LEFT JOIN products p ON s.product_id = p.id
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE ( i.store_id = ? AND i.id = ?)
    `;

        const [results] = await db.query(query, [store_id, invoice_id]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}

module.exports = {
    createInvoice,
    addSales,
    getAllInvoices,
    getInvoiceDetails,
    getAllInvoicesByAgent,
    getAllInvoicesByCustomer,
    getAllUnpaidInvoicesByCustomer,
};