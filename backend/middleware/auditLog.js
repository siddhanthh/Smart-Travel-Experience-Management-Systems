const AuditLog = require('../models/AuditLog');

const auditLog = (action, entity) => async (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    res.json = originalJson; // Restore standard behavior
    
    // Log asynchronously after response is sent
    if (res.statusCode >= 200 && res.statusCode < 300) {
      AuditLog.create({
        userId: req.user?.id || null,
        action,
        entity,
        entityId: req.params.id || data?.data?.id || null,
        changes: { body: req.body, query: req.query },
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }).catch((err) => console.error('Audit Log Error:', err));
    }

    return res.json(data);
  };

  next();
};

module.exports = auditLog;