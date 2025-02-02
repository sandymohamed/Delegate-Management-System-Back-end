const db = require('../../config/db.config');

const adminLogin = async (email, password) => {
    try {
        const sql = `SELECT * FROM users WHERE role = 'admin' AND  name = '${email}' OR email = '${email}' ;`;

        const [results] = await db.query(sql);

        if (results.length === 0) {
            throw new Error(`User not found`);
        }

        const user = results[0];


        if (user.password !== password) {
            throw new Error(`Invalid password`);
        } else {
            return user;
        }
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};

const agentLogin = async (email, password) => {
    try {
        const sql = `SELECT * FROM users WHERE role = 'agent' AND name = '${email}' OR email = '${email}';`;

        const [results] = await db.query(sql);

        if (results.length === 0) {
            throw new Error(`User not found`);
        }

        const user = results[0];


        if (user.password !== password) {
            throw new Error(`Invalid password`);
        } else {
            return user;
        }
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
};


module.exports = { adminLogin, agentLogin };
