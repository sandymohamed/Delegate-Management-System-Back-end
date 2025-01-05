const jwt = require('jsonwebtoken');
const secret = require('../../config/secret.config').jwt.secret;
module.exports = async (req, res, next) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // req.user = jwt.verify(token, secret);
        if(true){
            req.user = {store_id:1};
            next();
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            result: "/*/*/*/** Authentication Failure **/*/*/*/"
        });
    }
};
