const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, getUserById, updateUser, deleteUser } = require('../controllers/users.controller');

// const hashPII = require('../middlewares/hashPII');;
// const unhashPII = require('../middlewares/unhashPII');


const validateStoreId = require('../middlewares/validateStoreId');
// TODO: add checkAuthAdmin middleware
// const checkAuth = require('../middlewares/check-auth');
const checkAuthAdmin = require('../middlewares/check-auth-admin');


// router.get('/', checkAuthAdmin, getAllUsers, unhashPII, (req, res) => {
//     res.json({
//         success: true,
//         data: res.locals.data,
//     });
// });

// router.get('/:id', checkAuthAdmin, getUserById, unhashPII, (req, res) => {
//     res.json({
//         success: true,
//         data: res.locals.data,
//     });
// });

// router.post('/', checkAuthAdmin, validateStoreId, hashPII, createUser);
// router.put('/:id', checkAuthAdmin, validateStoreId, hashPII, updateUser);

router.get('/', checkAuthAdmin, getAllUsers);

router.get('/:id', checkAuthAdmin, getUserById);

router.post('/', checkAuthAdmin, validateStoreId, createUser);
router.put('/:id', checkAuthAdmin, validateStoreId, updateUser);
router.delete('/:id', checkAuthAdmin, deleteUser);

module.exports = router;
