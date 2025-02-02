const crypto = require('crypto');
require('dotenv').config();

const algorithm = process.env.ALGORITHM;
const key = process.env.KEY;

// Encrypt a string
const encrypt = (data) => {
    let cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex');

    return { encrypted };
};


const decrypt = (encryptedData) => {
    try {

        var decipher = crypto.createDecipher(algorithm, key);
        var decrypted = decipher.update(encryptedData, 'hex', 'utf8')
        decrypted += decipher.final('utf8');

        return { decrypted };
    } catch (err) {
        console.error("[ERROR] Decryption failed:", err.message);
        throw new Error("Decryption failed. Please check your inputs.");
    }
};



const hashPassword = (password) => {
    const salt = process.env.SALT1;
    const salt2 = process.env.SALT2;

    const hash = crypto.createHash('sha1')
        .update(password + salt)
        .digest('hex');

    const hash2 = crypto.createHash('sha1')
        .update(hash + salt2)
        .digest('hex');

    return hash2;


};




module.exports = { encrypt, decrypt, hashPassword };
