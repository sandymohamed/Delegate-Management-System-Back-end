const db = require('../../config/db.config'); 


const validateStoreId = async (req, res, next) => {
    console.log("req.body: ", req.body);

    const { store_id } = req.body;
    console.log("store_id: ", store_id);
    
    if (!store_id) {
        return res.status(400).json({ error: 'store_id is required.' });
    }
    try {
        const [rows] = await db.query('SELECT id FROM stores WHERE id = ?', [store_id]);
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid store_id.' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = validateStoreId;
