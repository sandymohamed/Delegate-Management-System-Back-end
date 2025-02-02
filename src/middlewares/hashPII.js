const { encrypt } = require('./encryption');

const hashPII = (req, res, next) => {

    const piiFields = ['name', 'email', 'phone'];
    req.body = { ...req.body };
    const phoneRegex = /^[0-9]{7,15}$/;

    if (req.body.phone) {

        if (!phoneRegex.test(req.body.phone)) {
            return res.status(400).json({ error: 'Invalid phone number format.' });
        }
    }

    piiFields.forEach((field) => {
        if (req.body[field]) {
            const { encrypted } = encrypt(req.body[field]);
            req.body[field] = encrypted;
        }
    });

    next();
};


module.exports = hashPII;
