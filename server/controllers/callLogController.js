// server/controllers/callLogController.js
const CallLog = require('../models/CallLog');

// Get all call logs
exports.getAllCallLogs = async (req, res) => {
  try {
    // Sort by newest first
    const logs = await CallLog.find({}).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch call logs' });
  }
};

exports.getCallLogById = async (req, res) => {
  try {
    const log = await CallLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Call log not found' });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch call log' });
  }
};