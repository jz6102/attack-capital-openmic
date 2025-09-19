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

module.exports = async function postcallHandler(req, res) {
  try {
    if (!verifySecret(req)) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const body = req.body || {};
    const call_id = body.call_id || body.id || `call_${Date.now()}`;
    const transcript = body.transcript || body.records || '';
    const summary = body.summary || '';
    const bot_uid = body.bot_uid || (body.metadata && body.metadata.bot_uid);

    logger.info('Post-call received', { call_id, bot_uid });

    // Upsert call log and append event
    await CallLog.findOneAndUpdate(
      { call_id },
      {
        $set: { transcript, summary, bot_uid, status: 'postcall_done' },
        $push: { events: { type: 'postcall', payload: { request: body } } }
      },
      { upsert: true, new: true }
    );

    return res.json({ status: 'received' });
  } catch (err) {
    logger.error('postcall error', err);
    return res.status(500).json({ error: 'postcall_failed' });
  }
};
