require('dotenv').config();

module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET_KEY,
    }
}