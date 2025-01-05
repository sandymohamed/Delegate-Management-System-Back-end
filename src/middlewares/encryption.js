const crypto = require('crypto');
require('dotenv').config();

const algorithm =  process.env.ALGORITHM;
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
        console.log("algorithm, key", algorithm, key);
        
        var decipher = crypto.createDecipher(algorithm, key);
        var decrypted = decipher.update(encryptedData, 'hex', 'utf8')
        decrypted += decipher.final('utf8');
        console.log("decrypted", decrypted);

        return { decrypted };
    } catch (err) {
        console.error("[ERROR] Decryption failed:", err.message);
        throw new Error("Decryption failed. Please check your inputs.");
    }
};




module.exports = { encrypt, decrypt };
