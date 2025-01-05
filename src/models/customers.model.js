const db = require('../../config/db.config');


const findAll = async (store_id) => {
    const sql = `SELECT * FROM customers WHERE store_id = ${store_id}`;
    try {
        const [results] = await db.query(sql);
        return results;
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

const create = async (store_id, data) => {
    try {
        const sql = `INSERT INTO customers (store_id, name, email, phone, info, customer_store_name, location) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await db.query(sql, [store_id, data.name, data.email, data.phone, data.info, data.customer_store_name, data.location]);
        return ({ message: 'Customer created successfully!' });
    } catch (error) {
        console.log("error", error);
        return ({ error: error.message });
    }
};

const update = async (id, data, store_id) => {
    try {
        const sql = 'UPDATE customers SET  name = ?, email = ?, phone = ?, info = ?, customer_store_name = ?, location = ? WHERE id = ? AND store_id = ?';
        const [result] = await db.query(sql, [data.name, data.email, data.phone, data.info, data.customer_store_name, data.location, id, store_id]);
        return ({ message: 'Customer Updated successfully!', result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteById = async (id, store_id) => {
    const sql = `DELETE FROM customers WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql, [id]);
        return ({ success: true, results });
    } catch (error) {
        return ({ success: false, error: error.message });
    }
};

module.exports = { findAll, create, findById, update, deleteById };
