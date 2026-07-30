const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.use(authenticate);
router.use(authorizeRoles('admin'));

/**
 * @openapi
 * /admin/stats:
 *   get:
 *     summary: Get system dashboard metrics and statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats summary
 */
router.get('/stats', adminController.getDashboardStats);

/**
 * @openapi
 * /admin/audit-logs:
 *   get:
 *     summary: Get system audit trail logs
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of audit log events
 */
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;