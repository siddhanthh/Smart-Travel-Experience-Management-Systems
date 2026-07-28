const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: Number },
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    changes: { type: Object },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: true }
);

auditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);