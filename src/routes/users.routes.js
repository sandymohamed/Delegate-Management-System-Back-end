const express = require('express');
const router = express.Router();

const db = require('../../config/db.config');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/users.controller');

const hashPII = require('../middlewares/hashPII');;
const unhashPII = require('../middlewares/unhashPII');
const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
// const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth');



router.get('/', checkAuthAdmin, getAllUsers, unhashPII, (req, res) => {
    res.status(200).json({
        success: true,
        data: res.locals.data,
    });
});

router.get('/:id', checkAuthAdmin, getUserById, unhashPII, (req, res) => {
    res.status(200).json({
        success: true,
        data: res.locals.data,
    });
});

router.post('/', checkAuthAdmin, validateStoreId, hashPII, createUser);
router.put('/:id', checkAuthAdmin, validateStoreId, hashPII, updateUser);
router.delete('/:id', checkAuthAdmin, deleteUser);

module.exports = router;
