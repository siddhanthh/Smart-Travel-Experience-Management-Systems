const expenseService = require('../services/expenseService');

exports.addExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.addExpense(req.body, req.user.id);
    res.status(201).json({ message: 'Expense added and split successfully', data: expense });
  } catch (err) {
    next(err);
  }
};

exports.getTripExpenses = async (req, res, next) => {
  try {
    const expenses = await expenseService.getTripExpenses(req.params.tripId);
    res.status(200).json({ data: expenses });
  } catch (err) {
    next(err);
  }
};

exports.getTripBalances = async (req, res, next) => {
  try {
    const balances = await expenseService.getTripBalances(req.params.tripId);
    res.status(200).json({ data: balances });
  } catch (err) {
    next(err);
  }
};

exports.settlePayment = async (req, res, next) => {
  try {
    const settlement = await expenseService.settlePayment(req.body, req.user.id);
    res.status(200).json({ message: 'Settlement completed', data: settlement });
  } catch (err) {
    next(err);
  }
};