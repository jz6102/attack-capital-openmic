const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
  uid: String,
  name: String,
  domain: String,
  prompt: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bot', BotSchema);
