const Customer = require('../models/customers.model');

const getAllCustomers = async (req, res, next) => {
    try {
        const store_id = req.user.store_id;

        const users = await Customer.findAll(store_id);
        res.locals.data = users;
        next();
    } catch (error) {
        console.error("[ERROR] Failed to fetch customers:", error.message);

        res.status(500).json({
            success: false,
            error: "Failed to fetch customers. Please try again later."
        });
    }
};

const getCustomerById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const store_id = req.user.store_id;
        const user = await Customer.findById(id, store_id);

        if (user) {
            res.locals.data = user;
            next();
        }
        else res.status(404).send('Customer not found');


    } catch (err) {
        res.status(500).send(err);
    }
};


const createCustomer = async (req, res) => {
    try {
        const store_id = req.user.store_id;
        const user = await Customer.create(store_id, req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).send(err);
    }
};



const updateCustomer = async (req, res) => {

    try {
        const store_id = req.user.store_id;
        const id = req.params.id;

        const user = await Customer.update(id, req.body, store_id);
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const store_id = req.user.store_id;
        const id = req.params.id;
        console.log("store_id", store_id, id);
        
        const result =  await Customer.deleteById(id, store_id);
        console.log("result fff", result);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = { getAllCustomers, createCustomer, getCustomerById, updateCustomer, deleteCustomer };
