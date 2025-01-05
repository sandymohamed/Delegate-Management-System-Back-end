const express = require('express');
const router = express.Router();

const db = require('../../config/db.config');
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/users.controller');

const hashPII = require('../middlewares/hashPII');;
const unhashPII = require('../middlewares/unhashPII');
const validateStoreId = require('../middlewares/validateStoreId');
const checkAuth = require('../middlewares/check-auth');



router.get('/', checkAuth, getAllUsers, unhashPII, (req, res) => {
    res.status(200).json({
        success: true,
        data: res.locals.data,
    });
});

router.get('/:id', checkAuth, getUserById, unhashPII, (req, res) => {
    res.status(200).json({
        success: true,
        data: res.locals.data,
    });
});
router.post('/', checkAuth, validateStoreId, hashPII, createUser);
router.put('/:id', checkAuth, validateStoreId, hashPII, updateUser);
router.delete('/:id', checkAuth, deleteUser);

module.exports = router;
