const vanModel = require('../models/van.model');

const createVan = async (req, res) => {
    const { agent_id, name, plate_number } = req.body;
    const store_id = req.user.store_id;
    if(agent_id) {
        const vanByAgent = await vanModel.getVanByAgent(store_id, agent_id);
        console.log("vanByAgent", vanByAgent);
    
        if (vanByAgent.length > 0) {
                return res.status(400).json({ success: false, error: 'Agent already has a van' });
        }
        

    }
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
    const { searchTerm, limit, page } = req.body;

    try {
        const resultData = await vanModel.getVansByStore(store_id, searchTerm, limit, page);
        res.json(resultData);
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

const getVanByID = async (req, res) => {
    try {
        const store_id = req.user.store_id;
        const { id } = req.params;
        console.log("getVanByID id", id);

        const resultData = await vanModel.getVanById(store_id, id);
        res.json({ success: true, data: resultData });
    } catch (error) {
        console.log("Error in getVanByID controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const updateVan = async (req, res) => {
    const { van_id } = req.params;
    const { name, plate_number, agent_id } = req.body;
    const store_id = req.user.store_id;

    try {
        const vanByAgent = await vanModel.getVanByAgent(store_id, agent_id);

        if (vanByAgent.length > 1) {
            return res.status(400).json({ success: false, error: 'Agent already has a van' });
        }

        if (vanByAgent.length > 0) {
            if (vanByAgent[0].id !== van_id) {
                return res.status(400).json({ success: false, error: 'Agent already has a van' });
            }
        }
        const resultData = await vanModel.updateVan(van_id, name, plate_number, agent_id, store_id);
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
    getVanByID,
    updateVan,
    deleteVan,
};