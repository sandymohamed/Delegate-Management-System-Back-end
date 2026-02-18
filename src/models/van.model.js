const db = require('../../config/db.config');

// Create a new van
const createVan = async (store_id, agent_id, name, plate_number) => {
    try {
        const query = `
            INSERT INTO vans (store_id, agent_id, name, plate_number)
            VALUES (?, ?, ?, ?)
        `;
        const [results] = await db.query(query, [store_id, agent_id, name, plate_number]);

        if (results.affectedRows === 0) {
            throw new Error('Failed to create van');
        }
        return results;
    } catch (error) {
        console.log("Error in createVan:", error);
        throw error; // Propagate the error to the controller
    }
};

// Get all vans for a store
const getVansByStore = async (store_id, searchTerm, limit, page) => {
    try {
        const offset = (parseInt(page) - 1) * limit;

        const searchTermQuery = searchTerm
            ? ` AND (vans.name LIKE ? OR
                      vans.plate_number LIKE ? OR
                      U.name LIKE ?)`
            : "";

        let query = `SELECT vans.*, U.name AS agent_name  
        FROM vans
        LEFT JOIN users U
        ON vans.agent_id = U.id 
        WHERE vans.store_id = ?  ${searchTermQuery}`;

        if (limit) {
            query += ` LIMIT ? OFFSET ?`;
        }

        const searchValues = searchTerm ? Array(3).fill(`%${searchTerm}%`) : [];


        const [results] = await db.query(query, [store_id, ...searchValues, limit, offset]);

        const countQuery = `
        SELECT COUNT(*) AS count 
        FROM vans 
        LEFT JOIN users U ON vans.agent_id = U.id
        WHERE vans.store_id = ? ${searchTermQuery}
    `;

        const [countResult] = await db.query(countQuery, [store_id, ...searchValues]);
        const totalCount = countResult[0].count;

        if (results.length === 0) {
            throw new Error('No vans found for this store');
        }

        return {
            success: true,
            total: totalCount,
            limit,
            page,
            data: results,
        };
    } catch (error) {
        console.log("Error in getVansByStore:", error);
        throw error; // Propagate the error to the controller
    }
};

// Get all vans for a store
const getVanByAgent = async (store_id, agent) => {
    try {

        const query = 'SELECT * FROM vans WHERE ( store_id = ? AND agent_id = ?);';
        const [results] = await db.query(query, [store_id, agent]);

        if (results.length === 0) {
            throw new Error('No vans found for this store');
        }
        return results;
    } catch (error) {
        console.log("Error in getVanByAgent model:", error);
        throw error; // Propagate the error to the controller
    }
};

// Get all vans for a store
const getVanById = async (store_id, id) => {
    try {
        const query = `SELECT vans.*, U.name as agent_name
         FROM vans
         LEFT JOIN users U ON vans.agent_id = U.id  
          WHERE ( vans.store_id = ? AND vans.id = ?);`;
        const [results] = await db.query(query, [store_id, id]);

        if (results.length === 0) {
            throw new Error('No vans found for this id');
        }
        return results[0];
    } catch (error) {
        console.log("Error in getVanById:", error);
        throw error; // Propagate the error to the controller
    }
};

// Update a van
const updateVan = async (van_id, name, plate_number, agent_id, store_id) => {
    try {
        const query = `
            UPDATE vans
            SET name = ?, plate_number = ?, agent_id = ?
            WHERE id = ? AND store_id = ?
        `;

        const [results] = await db.query(query, [name, plate_number, agent_id, van_id, store_id]);

        if (results.affectedRows === 0) {
            throw new Error('Failed to update van');
        }
        return results;
    } catch (error) {
        console.log("Error in updateVan:", error);
        throw error; // Propagate the error to the controller
    }
};

// Delete a van
const deleteVan = async (van_id, store_id) => {
    try {
        const query = 'DELETE FROM vans WHERE id = ? AND store_id = ?';
        const [results] = await db.query(query, [van_id, store_id]);

        if (results.affectedRows === 0) {
            throw new Error('Failed to delete van');
        }
        return results;
    } catch (error) {
        console.log("Error in deleteVan:", error);
        throw error; // Propagate the error to the controller
    }
};

module.exports = {
    createVan,
    getVansByStore,
    getVanByAgent,
    getVanById,
    updateVan,
    deleteVan,
};