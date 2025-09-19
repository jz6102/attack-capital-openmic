const Patient = require('../models/Patient');
const CallLog = require('../models/CallLog');
const logger = require('../utils/logger');

function verifySecret(req) {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true; // no secret configured -> allow
  const header = (req.headers && req.headers['x-webhook-secret']) || (req.headers && req.headers['X-Webhook-Secret']);
  const querySecret = req.query && req.query.secret;
  const bodySecret = req.body && req.body.secret;
  return header === secret || querySecret === secret || bodySecret === secret;
}

module.exports = async function precallHandler(req, res) {
  try {
    if (!verifySecret(req)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const body = req.body || {};
    const call_id = body.call_id || body.id || `call_${Date.now()}`;
    const bot_uid = (body.metadata && body.metadata.bot_uid) || null;
    logger.info('Pre-call webhook received', { call_id, bot_uid });

    // Look up patient by metadata.patient_id or phone in payload
    let patient = null;
    if (body.metadata && body.metadata.patient_id) {
      patient = await Patient.findOne({ medicalId: body.metadata.patient_id }).lean();
    } else if (body.phone) {
      patient = await Patient.findOne({ phone: body.phone }).lean();
    }

    // If not found, return a friendly "no data" object (OpenMic expects something)
    if (!patient) {
      patient = {
        medicalId: 'UNKNOWN',
        name: 'Unknown Patient',
        allergies: [],
        notes: 'No patient record found for this caller',
      };
    }

    // Save log
    await CallLog.create({
      call_id,
      bot_uid,
      events: [{ type: 'precall', payload: { request: body, response: patient } }],
      status: 'precall_done'
    });

    // Respond with patient info (this will be used by OpenMic)
    return res.json({ patient });

  } catch (err) {
    logger.error('precall error', err);
    return res.status(500).json({ error: 'precall_failed' });
  }
};
