const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authenticate } = require('../middleware/auth');
const { isTripMember } = require('../middleware/membership');
const auditLog = require('../middleware/auditLog');
const validate = require('../middleware/validate');
const { addExpenseSchema, settleSchema } = require('../validators/expenseValidator');

router.use(authenticate);

/**
 * @openapi
 * /expenses:
 *   post:
 *     summary: Add an expense and auto-split among trip members
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [trip_id, title, amount]
 *             properties:
 *               trip_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Expense added and split successfully
 */
router.post('/', validate(addExpenseSchema), isTripMember, auditLog('CREATE', 'expense'), expenseController.addExpense);

/**
 * @openapi
 * /expenses/trip/{tripId}:
 *   get:
 *     summary: List expenses for a trip
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get('/trip/:tripId', isTripMember, expenseController.getTripExpenses);

/**
 * @openapi
 * /expenses/trip/{tripId}/balances:
 *   get:
 *     summary: Get net balance breakdown for a trip (who owes who)
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Outstanding balance summary
 */
router.get('/trip/:tripId/balances', isTripMember, expenseController.getTripBalances);

/**
 * @openapi
 * /expenses/settle:
 *   post:
 *     summary: Settle an outstanding balance between two users
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [trip_id, payee_id, amount]
 *             properties:
 *               trip_id:
 *                 type: integer
 *               payee_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Settlement completed
 */
router.post('/settle', validate(settleSchema), isTripMember, auditLog('SETTLE', 'settlement'), expenseController.settlePayment);

module.exports = router;