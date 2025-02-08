const db = require('../../config/db.config');

// Add multiple products to daily inventory for a van
const addDailyInventory = async (van_id, products, date, user_id) => {
    try {

        const query = `INSERT INTO  daily_inventory (user_id,van_id, product_id, quantity, date) VALUES ? `;
        const values = products.map(product => [user_id,van_id, product.product_id, product.quantity, date]);

        const [results] = await db.query(query, [values]);

        if (results.affectedRows === 0) {
            throw new Error('Something went wrong!' );
        }
        return results;

    } catch (error) {
        console.log("error in addDailyInventory", error);
        throw error;
    }

}
// Get daily inventory for a van on a specific date
const getDailyInventoryByVan = async (van_id, date) => {
    try {

        const query = `Select di.*, p.name AS product_name, p.price FROM daily_inventory di JOIN products p ON di.product_id = p.id WHERE di.van_id = ? AND di.date = ?`;

        const [results] = await db.query(query, [van_id, date]);
        if (results.affectedRows === 0) {
            throw new Error('Something went wrong!' );
        }
        return results;

    } catch (error) {
        console.log("error in getDailyInventoryByVan", error);
        throw error;
    }

}
// Get current inventory for a van
const getAllProductsInVan = async (van_id) => {
    try {
        const query = `
            SELECT 
                di.product_id, 
                p.name AS product_name, 
                p.price, 
                SUM(di.quantity) AS total_quantity
            FROM 
                daily_inventory di
            JOIN 
                products p ON di.product_id = p.id
            WHERE 
                di.van_id = ? 
            GROUP BY 
                di.product_id, p.name, p.price;
        `;

        const [results] = await db.query(query, [van_id]);

        if (results.length === 0) {
            throw new Error('No inventory found for this van and date');
        }
        
        return results;
    } catch (error) {
        console.log("error in getDailyInventoryByVan", error);
        throw error;
    }
};


// Update product quantity in daily inventory
const updateDailyInventory = async (inventory_id, quantity, user_id) => {
    try {

        const query = `UPDATE daily_inventory SET quantity = ?, user_id = ? WHERE id = ?`;
        const [results] = await db.query(query, [quantity,user_id, inventory_id]);
        console.log("response in updateDailyInventory", results);

        if (results.affectedRows === 0) {
            throw new Error('Something went wrong!' );
        }
        return results;

    } catch (error) {
        console.log("error in updateDailyInventory", error);
        throw error;
    }

}

// Delete a product from daily inventory
const deleteDailyInventory = async (inventory_id, ) => {
    try {
        const query = `DELETE FROM daily_inventory WHERE id = ?`;
        const [results] = await db.query(query, [inventory_id]);
        console.log("response in deleteDailyInventory ", results);

        if (results.affectedRows === 0) {
            throw new Error('Something went wrong!' );
        }
        return results;

    } catch (error) {
        console.log("error in deleteDailyInventory ", error);
        throw error;
    }

}



module.exports = {
    addDailyInventory,
    getDailyInventoryByVan,
    getAllProductsInVan,
    updateDailyInventory,
    deleteDailyInventory,

}