const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/products.controller');

const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
// const checkAuth = require('../middlewares/check-auth');

const checkAuthAdmin = require('../middlewares/check-auth-admin');

router.get('/', checkAuthAdmin, getAllUsers);

router.get('/:id', checkAuthAdmin, getUserById);

router.post('/', checkAuthAdmin, validateStoreId, createUser);
router.put('/:id', checkAuthAdmin, validateStoreId, updateUser);
router.delete('/:id', checkAuthAdmin, deleteUser);

module.exports = router;
