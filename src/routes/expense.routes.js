const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
// TODO: add checkAuthAdmin middleware
const checkAuth = require('../middlewares/check-auth');
// const checkAuthAdmin = require('../middlewares/check-auth-admin');


router.post('/', checkAuth, expenseController.addExpense);
router.get('/', checkAuth, expenseController.getAllExpenses);
router.get('/agents/:agent_id/expenses/:date', checkAuth, expenseController.getExpensesByAgent);
router.put('/:van_id', checkAuth, expenseController.updateExpense);
router.delete('/:van_id', checkAuth, expenseController.deleteExpense);

module.exports = router;
