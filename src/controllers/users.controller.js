const { hashPassword } = require('../middlewares/encryption');
const User = require('../models/users.model');

const getAllUsers = async (req, res) => {
    try {
        const store_id = req.user.store_id;

        const users = await User.findAll(store_id);
        res.json({ success: true, data: users, });

    } catch (error) {
        console.error("[ERROR] Failed to fetch users:", error.message);

        res.status(500).json({
            success: false,
            error: "Failed to fetch users. Please try again later."
        });
    }
};

const getAllAgents = async (req, res) => {
    try {
        const store_id = req.user.store_id;

        const users = await User.findAllAgents(store_id);
        res.json({ success: true, data: users, });

    } catch (error) {
        console.error("[ERROR] Failed to fetch users:", error.message);

        res.status(500).json({
            success: false,
            error: "Failed to fetch users. Please try again later."
        });
    }
};

const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const store_id = req.user.store_id;
        const user = await User.findById(id, store_id);

        if (user) {
            // res.locals.data = user;
            // next();
            res.json({ success: true, data: user, });
        }

        else res.status(404).send('User not found');


    } catch (err) {
        res.status(500).send(err);
    }
};


const createUser = async (req, res) => {
    try {
        req.body.password = hashPassword(req.body.password);
        const store_id = req.user.store_id;
        const user = await User.create(store_id, req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};


const updateUser = async (req, res) => {

    try {
        const store_id = req.user.store_id;

        const user = await User.update(req.params.id, req.body, store_id);
        res.status(204).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteUser = async (req, res) => {
    try {
        const store_id = req.user.store_id;

        const result = await User.deleteById(req.params.id, store_id);
        res.status(204).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { getAllUsers,getAllAgents, createUser, getUserById, updateUser, deleteUser };
