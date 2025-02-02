const expenseModel = require('../models/expense.model');

const addExpense = (req, res) => {
    const {  agent_id, amount, description, date } = req.body;
    const store_id = req.user.store_id;

    try {
        const resultData = expenseModel.addExpense(store_id, agent_id, amount, description, date);
        if (!resultData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.status(201).json({ success: true, message: 'Expense added successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const getAllExpenses = (req, res) => {
    const store_id = req.user.store_id;

    try {
        const resultData = expenseModel.getAllExpenses(store_id);
        if (!resultData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.json({ success: true, resultData });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const getExpensesByAgent = (req, res) => {
    const { agent_id, date } = req.params;
    const store_id = req.user.store_id;

    try {
        const resultData = expenseModel.getExpensesByAgent(agent_id, date, store_id);
        if (!resultData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.json({ success: true, resultData });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const updateExpense = (req, res) => {
    const { expense_id } = req.params;
    const { amount, description } = req.body;
    const store_id = req.user.store_id;

    try {
        const resultData = expenseModel.updateVan(expense_id, amount, description, store_id);
        if (!resultData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.status(204).json({ success: true, message: 'Expense updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

const deleteExpense = (req, res) => {
    const { expense_id } = req.params;
    const store_id = req.user.store_id;


    try {
        const resultData = expenseModel.deleteVan(expense_id, store_id);
        if (!resultData) return res.status(500).json({ success: false, error: "Error: Something went wrong!" });

        res.status(204).json({ success: true, message: 'Expense deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    addExpense,
    getExpensesByAgent,
    getAllExpenses,
    updateExpense,
    deleteExpense,
};