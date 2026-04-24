import AuditLog from '../models/AuditLog.js';
import logger from '../utils/logger.js';

// Get all audit logs (Admin only)
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('admin', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    logger.error('Error fetching audit logs:', error);
    res.status(500).json({ message: error.message });
  }
};

// Internal: Create Audit Log
export const logAdminAction = async (adminId, action, module, details = {}, ip = '') => {
  try {
    await AuditLog.create({
      admin: adminId,
      action,
      module,
      details,
      ipAddress: ip
    });
  } catch (error) {
    logger.error('Audit Log Error:', error);
  }
};
