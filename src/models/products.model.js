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

        let sql = `SELECT * FROM products WHERE store_id = ${store_id} ${searchTermCondition} `;

        if (limit) {
            sql += `LIMIT ${limit} OFFSET ${offset}`;
        }

        const [results] = await db.query(sql);


        let countQuery = `SELECT COUNT(*) FROM products WHERE store_id = ${store_id} ${searchTermCondition} `;

        const [resultsCountQuery] = await db.query(countQuery);

        return {
            success: true,
            total: resultsCountQuery[0]['COUNT(*)'],
            limit,
            page,
            data: results,
        }
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

const create = async (store_id, product) => {
    try {
        const sql = `INSERT INTO products (store_id, name, price, description, qr_code, stock_quantity, exp_date) VALUES (?,?, ?, ?, ?, ?, ?)`;
        const [results] = await db.query(sql, [store_id, product.name, product.price, product.description, product.qr_code, product.stock_quantity, product.exp_date]);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Product not found' });
        }

        return (results);
    } catch (error) {
        console.log("error", error);

        throw new Error(`Database Error: ${error.message}`);
    }
};

const update = async (id, product, store_id) => {
    try {
        const sql = 'UPDATE products SET  name = ?, price = ?, description = ?, qr_code = ?, stock_quantity = ?, exp_date = ? WHERE id = ? AND store_id = ?';
        const [result] = await db.query(sql, [product.name, product.price, product.description, product.qr_code, product.stock_quantity, product.exp_date, id, store_id]);

        if (result.affectedRows === 0) {
            return ({ success: false, error: 'Product not found' });
        }

        return ({ success: true, message: 'Product Updated successfully!', result });
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};
const reduceStock = async (id, quantity, store_id) => {
    try {
        const [product] = await findById(id, store_id);

        if (!product) {
            return ({ success: false, error: 'Product not found' });
        }

        const safeQuantity = Math.abs(quantity);
        const newStockQuantity = product.stock_quantity - safeQuantity;

        if (newStockQuantity < 0) {
            return ({ success: false, error: 'Stock quantity is not enough' });
        }

        if (newStockQuantity === product.stock_quantity) {
            return ({ success: false, error: 'Stock quantity is the same as the original' });
        }
        const sql = 'UPDATE products SET  stock_quantity = ?  WHERE id = ? AND store_id = ?';
        const [result] = await db.query(sql, [newStockQuantity, id, store_id]);

        if (result.affectedRows === 0) {
            return ({ success: false, error: 'Product not found' });
        }

        return ({ success: true, message: 'Product Updated successfully!', result });
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const deleteById = async (id, store_id) => {
    const sql = `DELETE FROM products WHERE store_id = ${store_id} AND id = ${id}`;
    try {
        const [results] = await db.query(sql);

        if (results.affectedRows === 0) {
            return ({ success: false, error: 'Product not found' });
        }
        return ({ success: true, results });
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

module.exports = { findAll, create, findById, update, reduceStock, deleteById };
