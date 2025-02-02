const express = require('express');
const router = express.Router();
const {  adminLogin,agentLogin, authAccount} = require('../controllers/auth.controller');

// TODO: add checkAuthAdmin middleware
const checkAuth = require('../middlewares/check-auth');


router.post('/admin', adminLogin);
router.post('/agent', agentLogin);
router.get('/account',checkAuth, authAccount);
// router.post('/hr', adminLogin);


module.exports = router;
