const { decrypt } = require('./encryption');

const unhashPII = (req, res, next) => {
    console.log("unhashPII res", res);
    
    const piiFields = ['name', 'email', 'phone']; // Add fields to decrypt

    if (Array.isArray(res.locals.data)) {
        // If the response is an array of objects
        res.locals.data = res.locals.data.map((item) => {
            piiFields.forEach((field) => {
                if (item[field] ) {
                    decryptItem = decrypt(item[field]);
                    item[field] = decryptItem.decrypted;

                    console.log("item[field]", item[field]);
                    
                }
            });
            return item;
        });
    } else if (res.locals.data) {
        // If the response is a single object
        piiFields.forEach((field) => {
            if (res.locals.data[field] && res.locals.data[`${field}_iv`]) {
                res.locals.data[field] = decrypt(res.locals.data[field]);
            }
        });
    }

    next();
};

module.exports = unhashPII;


