const db = require('../../config/db.config');


// create a new invoice
const createInvoice = async (store_id, agent_id, customer_id, invoice_number, due_date, total_price, discount, total_after_discount) => {
    try {
        console.log("invoice_number", invoice_number);

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
    i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid, i.returned_amount,
 
      (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price,
                'product_name', p.name
            )
        ) 
        FROM sales s
        LEFT JOIN products p ON s.product_id = p.id
        WHERE s.invoice_id = i.id
    ) AS products,

       COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN r.product_id IS NOT NULL THEN JSON_OBJECT(
                    'product_id', r.product_id,
                    'return_quantity', r.return_quantity,
                    'return_amount', r.return_amount
                )
                ELSE NULL 
            END
        ), JSON_ARRAY()
    ) AS returns
FROM invoices i
LEFT JOIN sales s ON (i.id = s.invoice_id AND i.store_id = ?)
LEFT JOIN return_items r ON (i.id = r.invoice_id)
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

// get all invoices for admin
const getAllInvoicesAdmin = async (store_id, searchTerm = "", limit = 100, page = 1) => {
    try {
        limit = parseInt(limit) || 100;
        const offset = (parseInt(page) - 1) * limit;


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
            i.id, i.store_id, i.agent_id, i.invoice_number, 
            i.invoice_date, i.due_date, i.total_price, i.discount, 
            i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
            i.customer_id,
            c.name AS customer_name,
            c.customer_store_name,
            c.phone AS customer_phone,
            c.location AS customer_location,
            c.total_unpaid_invoices AS customer_total_unpaid_invoices,

                  (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price,
                'product_name', p.name
            )
        ) 
        FROM sales s
        LEFT JOIN products p ON s.product_id = p.id
        WHERE s.invoice_id = i.id
    ) AS products,

               COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN r.product_id IS NOT NULL THEN JSON_OBJECT(
                    'product_id', r.product_id,
                    'return_quantity', r.return_quantity,
                    'return_amount', r.return_amount
                )
                ELSE NULL 
            END
        ), JSON_ARRAY()
    ) AS returns
            FROM invoices i 
            LEFT JOIN customers c ON i.customer_id = c.id
            LEFT JOIN sales s ON i.id = s.invoice_id
            LEFT JOIN return_items r ON (i.id = r.invoice_id)
            WHERE i.store_id = ?  ${searchTermQuery}
            GROUP BY i.id
            LIMIT ? OFFSET ?;
        `;

        // SQL query to get total count without pagination
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM invoices i
            WHERE i.store_id = ?  ${searchTermQuery};
        `;

        // Prepare search term values
        const searchValues = searchTerm ? Array(11).fill(`%${searchTerm}%`) : [];

        console.log("dataQuery", dataQuery, store_id, ...searchValues, limit, offset);
        console.log("countQuery", countQuery, store_id, ...searchValues,);

        // Execute queries
        const [results] = await db.query(dataQuery, [store_id, ...searchValues, limit, offset]);
        const [countResult] = await db.query(countQuery, [store_id, ...searchValues]);

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


const getAllInvoicesByAgent = async (store_id, agent_id, searchTerm = "", limit = 100, page = 1) => {
    try {
        limit = parseInt(limit) || 100;
        const offset = (parseInt(page) - 1) * limit;


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
            i.id, i.store_id, i.agent_id, i.invoice_number, 
            i.invoice_date, i.due_date, i.total_price, i.discount, 
            i.total_after_discount, i.is_paid, i.total_paid, i.total_unpaid,
            i.customer_id,
            c.name AS customer_name,
            c.customer_store_name,
            c.phone AS customer_phone,
            c.location AS customer_location,
            c.total_unpaid_invoices AS customer_total_unpaid_invoices,

                  (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price,
                'product_name', p.name
            )
        ) 
        FROM sales s
        LEFT JOIN products p ON s.product_id = p.id
        WHERE s.invoice_id = i.id
    ) AS products,

               COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN r.product_id IS NOT NULL THEN JSON_OBJECT(
                    'product_id', r.product_id,
                    'return_quantity', r.return_quantity,
                    'return_amount', r.return_amount
                )
                ELSE NULL 
            END
        ), JSON_ARRAY()
    ) AS returns
            FROM invoices i 
            LEFT JOIN customers c ON i.customer_id = c.id
            LEFT JOIN sales s ON i.id = s.invoice_id
            LEFT JOIN return_items r ON (i.id = r.invoice_id)
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
            i.id, i.store_id,
            i.agent_id,
            i.invoice_number, 
            i.invoice_date, 
            i.due_date, 
            i.total_price, 
            i.discount, 
            i.total_after_discount,
            i.is_paid,
            i.total_paid,
            i.total_unpaid,
            i.customer_id,
            c.name AS customer_name,
            c.customer_store_name,
            c.phone AS customer_phone,
            c.location AS customer_location,
            c.total_unpaid_invoices AS customer_total_unpaid_invoices,
            (
            SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                    'product_id', s.product_id,
                    'quantity', s.quantity,
                    'price', s.price,
                    'product_total_price', s.total_price,
                    'product_name', p.name
                )
            ) 
            FROM sales s
                LEFT JOIN products p ON s.product_id = p.id
            WHERE s.invoice_id = i.id
            ) AS products,
            COALESCE(
                JSON_ARRAYAGG(
                CASE 
                    WHEN r.product_id IS NOT NULL THEN JSON_OBJECT(
                    'product_id', r.product_id,
                    'return_quantity', r.return_quantity,
                    'return_amount', r.return_amount
                    )
                    ELSE NULL 
                END
                ), JSON_ARRAY()
            ) AS returns
        FROM invoices i 
        LEFT JOIN customers c ON i.customer_id = c.id

        LEFT JOIN sales s ON (i.id = s.invoice_id )
        LEFT JOIN return_items r ON (i.id = r.invoice_id)
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
    ) AS products,
      COALESCE(
        JSON_ARRAYAGG(
            CASE 
                WHEN r.product_id IS NOT NULL THEN JSON_OBJECT(
                    'product_id', r.product_id,
                    'return_quantity', r.return_quantity,
                    'return_amount', r.return_amount,
                    'reason', r.reason,
                    'return_date', r.return_date
                )
                ELSE NULL 
            END
        ), JSON_ARRAY()
    ) AS returns
FROM invoices i 
LEFT JOIN sales s ON (i.id = s.invoice_id )
LEFT JOIN return_items r ON (i.id = r.invoice_id)
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
SELECT 
    i.id AS invoice_id, 
    i.*, 
    c.name AS customer_name,
    c.customer_store_name,
    c.phone AS customer_phone,
    c.location AS customer_location,
    c.total_unpaid_invoices AS customer_total_unpaid_invoices,

    -- ✅ Aggregate Products Separately
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', s.product_id,
                'quantity', s.quantity,
                'price', s.price,
                'product_total_price', s.total_price,
                'product_name', p.name
            )
        ) 
        FROM sales s
        LEFT JOIN products p ON s.product_id = p.id
        WHERE s.invoice_id = i.id
    ) AS products,

    -- ✅ Aggregate Returns Separately
    (
        SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
                'product_id', r.product_id,
                'return_quantity', r.return_quantity,
                'return_amount', r.return_amount,
                'reason', r.reason,
                'return_date', r.return_date
            )
        ) 
        FROM return_items r
        WHERE r.invoice_id = i.id
    ) AS returns

FROM invoices i
LEFT JOIN customers c ON i.customer_id = c.id

WHERE i.store_id = ? AND i.id = ?;


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
const getInvoiceProductDetails = async (store_id, invoice_id, product_id) => {
    try {
        const query = `
            SELECT 
                s.*,
                COALESCE(
                    JSON_ARRAYAGG(
                        CASE 
                            WHEN r.product_id IS NOT NULL THEN JSON_OBJECT(
                                'product_id', r.product_id,
                                'return_quantity', r.return_quantity,
                                'return_amount', r.return_amount,
                                'reason', r.reason,
                                'return_date', r.return_date
                            )
                            ELSE NULL 
                        END
                    ), JSON_ARRAY()
                ) AS returns
            FROM sales s
            LEFT JOIN return_items r ON (s.invoice_id = r.invoice_id AND s.product_id = r.product_id)
            WHERE s.store_id = ? AND s.invoice_id = ? AND s.product_id = ?
            GROUP BY s.id
        `;

        const [results] = await db.query(query, [store_id, invoice_id, product_id]);

        if (results.length === 0) {
            return { success: false, error: 'Something went wrong!' };
        }

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

module.exports = {
    createInvoice,
    addSales,
    getAllInvoices,
    getInvoiceDetails,
    getAllInvoicesByAgent,
    getAllInvoicesByCustomer,
    getAllUnpaidInvoicesByCustomer,
    getInvoiceProductDetails,
    getAllInvoicesAdmin,
};