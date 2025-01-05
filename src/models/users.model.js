const db = require('../../config/db.config');


const findAll = async (store_id) => {
    const sql = `SELECT * FROM users WHERE store_id = ${store_id}`;
    try {
        const [results] = await db.query(sql);
        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const findById = async (id, store_id) => {
    const sql = `SELECT * FROM users WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql);
        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const create = async (store_id, user) => {
    try {
        const sql = `INSERT INTO users (store_id, name, email, password, phone, role) VALUES (?,?, ?, ?, ?, ?)`;
        await db.query(sql, [store_id, user.name, user.email, user.password, user.phone, user.role]);
        return ({ message: 'User created successfully!' });
    } catch (error) {
        console.log("error", error);
        return ({ error: error.message });
    }
};

const update = async (id, user, store_id) => {
    try {
        const sql = 'UPDATE users SET  name = ?, email = ?, phone = ?, password = ?, role = ? WHERE id = ? AND store_id = ?';
        const [result] = await db.query(sql, [user.name, user.email, user.phone, user.password, user.role, id, store_id]);

        return ({ message: 'User Updated successfully!', result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const deleteById = async (id, store_id) => {
    const sql = `DELETE FROM users WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql, [id]);
        return ({ success: true, results });
    } catch (error) {
        return ({ success: false, error: error.message });
    }
};

module.exports = { findAll, create, findById, update, deleteById };
