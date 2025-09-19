const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  type: String,
  payload: mongoose.Schema.Types.Mixed,
  ts: { type: Date, default: Date.now }
}, { _id: false });

const CallLogSchema = new mongoose.Schema({
  call_id: { type: String, required: true, index: true },
  bot_uid: { type: String },
  events: { type: [EventSchema], default: [] },
  transcript: { type: mongoose.Schema.Types.Mixed },
  summary: { type: String, default: '' },
  status: { type: String, default: 'created' }, 
}, { timestamps: true });

module.exports = mongoose.model('CallLog', CallLogSchema);
