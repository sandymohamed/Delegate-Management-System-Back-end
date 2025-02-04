const vanModel = require('../models/van.model');

const createVan = async (req, res) => {
    const { agent_id, name, plate_number } = req.body;
    const store_id = req.user.store_id;

    try {
        const resultData = await vanModel.createVan(store_id, agent_id, name, plate_number);
        res.json({ success: true, message: 'Van created successfully', van_id: resultData.insertId });
    } catch (error) {
        console.log("Error in createVan controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getVansByStore = async (req, res) => {
    const store_id = req.user.store_id;

    try {
        const resultData = await vanModel.getVansByStore(store_id);
        res.json({ success: true, data: resultData });
    } catch (error) {
        console.log("Error in getVansByStore controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};
const getVanByAgent = async (req, res) => {
    try {
    const store_id = req.user.store_id;
    const { user_id } = req.params;
    
        const resultData = await vanModel.getVanByAgent(store_id, user_id);
        res.json({ success: true, data: resultData });
    } catch (error) {
        console.log("Error in getVansByAgent controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateVan = async (req, res) => {
    const { van_id } = req.params;
    const { name, plate_number, agent_id } = req.body;
    const store_id = req.user.store_id;

    try {
        const resultData = await vanModel.updateVan(van_id, name, plate_number,agent_id, store_id);
        res.json({ success: true, message: 'Van updated successfully' });
    } catch (error) {
        console.log("Error in updateVan controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteVan = async (req, res) => {
    const { van_id } = req.params;
    const store_id = req.user.store_id;

    try {
        const resultData = await vanModel.deleteVan(van_id, store_id);
        res.json({ success: true, message: 'Van deleted successfully' });
    } catch (error) {
        console.log("Error in deleteVan controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    createVan,
    getVansByStore,
    getVanByAgent,
    updateVan,
    deleteVan,
};