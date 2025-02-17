const { hashPassword } = require('../middlewares/encryption');
const Auth = require('../models/auth.model');

const jwt = require("jsonwebtoken");
const jwtConfig = require('../../config/jwt.config');

const adminLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        console.log(" email, password",  email, password);
        
        password = hashPassword(password);

        const admin = await Auth.adminLogin(email, password);

        if (admin) {
            return res.json({
                success: true,
                payload: jwt.sign(admin,
                    jwtConfig.jwt.secret,
                    { expiresIn: jwtConfig.jwt.expireIn }),
                data: admin,
            });
        }

        else res.status(404).json('User not found');

    } catch (err) {
        res.status(500).json(err);
    }
};


const agentLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;

        password = hashPassword(password);

        const admin = await Auth.agentLogin(email, password);

        if (admin) {
            return res.json({
                success: true,
                payload: jwt.sign(admin,
                    jwtConfig.jwt.secret,
                    { expiresIn: jwtConfig.jwt.expireIn }),
                data: admin,
            });
        }

        else res.status(404).json('User not found');

    } catch (err) {
        console.log(err);
        
        res.status(500).json({success: false, error: `${err}`});
    }
};
const authAccount = async (req, res, next) => {
    try {
        if (req.user) return res.json({
            success: true,
            user: req.user,
        })

    } catch (err) {
        res.status(500).json({
            success: false,
            error: `Error: ${err}`,
        })
    }
};


module.exports = { adminLogin, agentLogin, authAccount };
