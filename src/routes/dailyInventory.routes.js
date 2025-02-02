const express = require('express');
const router = express.Router();

const dailyInventoryController = require('../controllers/dailyInventory.controller');
const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
const checkAuth = require('../middlewares/check-auth');
// const checkAuthAdmin = require('../middlewares/check-auth-admin');



router.post('/', checkAuth, validateStoreId, dailyInventoryController.addDailyInventory);
router.get('/:van_id/daily-inventory/:date', checkAuth, dailyInventoryController.getDailyInventoryByVan);
router.get('/van-products/:van_id', checkAuth, dailyInventoryController.getAllProductsInVan);
router.put('/:inventory_id', checkAuth, dailyInventoryController.updateDailyInventory);
router.delete('/:inventory_id', checkAuth, dailyInventoryController.deleteDailyInventory);

module.exports = router;
