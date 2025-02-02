const express = require('express');
const router = express.Router();

const vanController = require('../controllers/van.controller');
const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
const checkAuth = require('../middlewares/check-auth');
// const checkAuthAdmin = require('../middlewares/check-auth-admin');

router.post('/', checkAuth, validateStoreId, vanController.createVan);
router.get('/', checkAuth, vanController.getVansByStore);
router.get('/user/:user_id', checkAuth, vanController.getVanByAgent);
router.put('/:van_id', checkAuth, vanController.updateVan);
router.delete('/:van_id', checkAuth, vanController.deleteVan);

module.exports = router;
