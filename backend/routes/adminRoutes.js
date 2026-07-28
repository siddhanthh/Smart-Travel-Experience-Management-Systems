const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;