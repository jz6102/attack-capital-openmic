const Employee = require('../models/Patient'); // Using the same model file
const CallLog = require('../models/CallLog');
const logger = require('../utils/logger');

function verifySecret(req) {
  // ... (verifySecret function remains the same, no changes needed)
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true;
  const header = req.headers['x-webhook-secret'] || req.headers['X-Webhook-Secret'];
  const querySecret = req.query.secret;
  const bodySecret = req.body.secret;
  return header === secret || querySecret === secret || bodySecret === secret;
}

module.exports = async function functionHandler(req, res) {
  try {
    if (!verifySecret(req)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const body = req.body || {};
    const call_id = body.call_id || `call_${Date.now()}`;
    const args = body.arguments || {};
    const employeeId = args.employee_id;

    logger.info('Function call received for employee', { call_id, employeeId });

    if (!employeeId) {
      return res.status(400).json({ error: 'missing_employee_id' });
    }

    const employee = await Employee.findOne({ employeeId: employeeId }).lean();

    const responseData = employee ? 
        { name: employee.name, location: employee.location } :
        { name: 'Unknown', location: 'No employee found with that ID.' };

    await CallLog.findOneAndUpdate(
      { call_id },
      { $push: { events: { type: 'function_call', payload: { function: 'get_employee_location', request: args, response: responseData } } } }
    );

    return res.json({ status: 'ok', data: responseData });
  } catch (err) {
    logger.error('function handler error', err);
    return res.status(500).json({ error: 'function_failed' });
  }
};