const db = require('../../config/db.config');


const findAll = async (store_id, searchTerm, limit, page) => {

    try {
    const offset = (page - 1) * limit;
    const searchTermCondition = searchTerm ? `
    AND name LIKE '%${searchTerm}%' OR 
    qr_code LIKE '%${searchTerm}%' OR
    description LIKE '%${searchTerm}%' OR 
    price LIKE '%${searchTerm}%' OR 
    stock_quantity LIKE '%${searchTerm}%' OR 
    exp_date LIKE '%${searchTerm}%'  
    ` : '';

    const sql = `SELECT * FROM products WHERE store_id = ${store_id} ${searchTermCondition} `;

    if(limit) {
        sql += `LIMIT ${limit} OFFSET ${offset}`;
    }
    
        const [results] = await db.query(sql);
        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const findById = async (id, store_id) => {
    const sql = `SELECT * FROM products WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql);
        return results;
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

/*
store_id int 
name varchar(100) 
price decimal(10,2) 
created_at timestamp 
description text 
qr_code varchar(255) 
stock_quantity int 
exp_date timestamp
*/

const create = async (store_id, product) => {
    try {
        const sql = `INSERT INTO products (store_id, name, price, description, qr_code, stock_quantity, exp_date) VALUES (?,?, ?, ?, ?, ?, ?)`;
        const [results] = await db.query(sql, [store_id, product.name, product.price, product.description, product.qr_code, product.stock_quantity, product.exp_date ]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Customer not found' });
        }

        return (results);
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const update = async (id, user, store_id) => {
    try {
        const sql = 'UPDATE users SET  name = ?, email = ?, phone = ?, password = ?, role = ? WHERE id = ? AND store_id = ?';
        const [result] = await db.query(sql, [user.name, user.email, user.phone, user.password, user.role, id, store_id]);

        if (result.affectedRows === 0) {
            return ({ success: false, error: 'Customer not found' });
        }

        return ({ success: true, message: 'User Updated successfully!', result });
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const deleteById = async (id, store_id) => {
    const sql = `DELETE FROM users WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Customer not found' });
        }
        return ({ success: true, results });
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

module.exports = { findAll, create, findById, update, deleteById };
