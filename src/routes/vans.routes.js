const express = require('express');
const router = express.Router();

const vanController = require('../controllers/van.controller');
// const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');

router.post('/', checkAuthAdmin, vanController.createVan);
router.post('/all/', checkAuthAdmin, vanController.getVansByStore);
router.get('/', checkAuthAdmin, vanController.getVansByStore);
router.get('/user/:user_id', checkAuth, vanController.getVanByAgent);
router.get('/:id', checkAuth, vanController.getVanByID);
router.put('/:van_id', checkAuthAdmin, vanController.updateVan);
router.delete('/:van_id', checkAuthAdmin, vanController.deleteVan);

module.exports = router;
