const { parse } = require('dotenv');
const db = require('../../config/db.config');

const findAll = async (store_id, searchTerm, limit, page) => {
    try {
        // limit = parseInt(limit) || 100;
        const offset = (parseInt(page) - 1) * limit;
        // Construct search query
        const searchTermQuery = searchTerm
            ? `AND (customers.name LIKE ? OR
           customers.customer_store_name LIKE ? OR
           customers.phone LIKE ? OR
           customers.location LIKE ? OR
           customers.total_unpaid_invoices LIKE ? 
                  )`
            : "";

        let sql = `SELECT * FROM customers WHERE store_id = ? ${searchTermQuery}`;

        if (limit) {
            sql += ` LIMIT ? OFFSET ?`;
        }
        const searchValues = searchTerm ? Array(5).fill(`%${searchTerm}%`) : [];

        // console.log("searchValues", searchValues);

        const [results] = await db.query(sql, [store_id, ...searchValues, limit, offset]);

        const countQuery = `SELECT COUNT(*) AS count FROM customers WHERE store_id = ? ${searchTermQuery}`;
        const [countResult] = await db.query(countQuery, [store_id, ...searchValues]);
        const totalCount = countResult[0].count;

        return {
            success: true,
            total: totalCount,
            limit,
            page,
            data: results,
        };
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const findById = async (id, store_id) => {
    const sql = `SELECT * FROM customers WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql);

        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const findByInvoiceId = async (id, store_id) => {
    const sql = `
        SELECT invoices.customer_id, c.* 
        FROM invoices 
        LEFT JOIN customers c ON invoices.customer_id = c.id
        WHERE invoices.store_id = ? AND invoices.id = ?
    `;
    try {
        const [results] = await db.query(sql, [store_id, id]);
        console.log("results", results);
        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};


const create = async (store_id, data) => {
    try {
        const sql = `INSERT INTO customers (store_id, name, email, phone, info, customer_store_name, location) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [results] = await db.query(sql, [store_id, data.name, data.email, data.phone, data.info, data.customer_store_name, data.location]);
        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Something went wrong!' });
        }

        return results;
    } catch (error) {
        console.log("error", error);

        throw new Error(`Database Error: ${error.message}`);
    }
};

const update = async (id, data, store_id) => {
    try {
        const sql = 'UPDATE customers SET  name = ?, email = ?, phone = ?, info = ?, customer_store_name = ?, location = ? WHERE id = ? AND store_id = ?';
        const [result] = await db.query(sql, [data.name, data.email, data.phone, data.info, data.customer_store_name, data.location, id, store_id]);
        console.log("result", result.affectedRows);

        if (result.affectedRows === 0) {
            return ({ success: false, error: 'Customer not found' });
        }

        return ({ success: true, message: 'Customer Updated successfully!', result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteById = async (id, store_id) => {
    const sql = `DELETE FROM customers WHERE store_id = ${store_id} AND id = ${id}`;
    console.log("sql", sql);

    try {
        const [results] = await db.query(sql, [id]);
        console.log("results", results);

        if (results.affectedRows === 0) {
            console.log("affectedRows");
            return ({ success: false, error: 'Customer not found' });
        }
        return ({ success: true, results });
    } catch (error) {
        console.log("error", error);

        return ({ success: false, error: error.message });
    }
};

module.exports = { findAll, create, findById, findByInvoiceId, update, deleteById };
