const dailyInventoryModel = require('../models/dailyInventory.model');

// Add multiple products to daily inventory for a van
const addDailyInventory = async (req, res) => {
    let { van_id, products, date } = req.body;

    const {id} = req.user;
    try {
    if(!date) date  = new Date().toISOString().split('T')[0];

        const resultData = await dailyInventoryModel.addDailyInventory(van_id, products,date, id);
        res.status(201).json({ success: true, message: 'Daily inventory added successfully', result: resultData.insertId });
    } catch (error) {
        console.log("Error in addDailyInventory controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get daily inventory for a van on a specific date
const getDailyInventoryByVan = async (req, res) => {
    const { van_id, date } = req.params;
    try {
        const resultData = await dailyInventoryModel.getDailyInventoryByVan(van_id, date);
        res.json({ success: true, data: resultData });
    } catch (error) {
        console.log("Error in getDailyInventoryByVan controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};


// Get current inventory for a van
const getAllProductsInVan = async (req, res) => {
    const { van_id } = req.params;
    // const date  = new Date().toISOString().split('T')[0];

    try {
        const resultData = await dailyInventoryModel.getAllProductsInVan(van_id);
        res.json({ success: true, data: resultData });
    } catch (error) {
        console.log("Error in getAllProductsInVan controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update product quantity in daily inventory
const updateDailyInventory = async (req, res) => {
    const { inventory_id } = req.params;
    const { quantity } = req.body;
    const { id } = req.user;

    try {
        const resultData = await dailyInventoryModel.updateDailyInventory(inventory_id, quantity, id);
        res.json({ success: true, message: 'Product quantity updated successfully' });
    } catch (error) {
        console.log("Error in updateDailyInventory controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete a product from daily inventory
const deleteDailyInventory = async (req, res) => {
    const { inventory_id } = req.params;

    try {
        const resultData = await dailyInventoryModel.deleteDailyInventory(inventory_id);
        res.json({ success: true, message: 'Product removed from daily inventory' });
    } catch (error) {
        console.log("Error in deleteDailyInventory controller:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    addDailyInventory,
    getDailyInventoryByVan,
    getAllProductsInVan,
    updateDailyInventory,
    deleteDailyInventory,
};