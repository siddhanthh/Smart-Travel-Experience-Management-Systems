const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');
const { isTripMember } = require('../middleware/membership');
const auditLog = require('../middleware/auditLog');
const validate = require('../middleware/validate');
const { addExpenseSchema, settleSchema } = require('../validators/expenseValidator');

router.use(authenticate);

router.post('/', validate(addExpenseSchema), isTripMember, auditLog('CREATE', 'expense'), expenseController.addExpense);
router.get('/trip/:tripId', isTripMember, expenseController.getTripExpenses);
router.get('/trip/:tripId/balances', isTripMember, expenseController.getTripBalances);
router.post('/settle', validate(settleSchema), isTripMember, auditLog('SETTLE', 'settlement'), expenseController.settlePayment);

module.exports = router;