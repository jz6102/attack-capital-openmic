// server/controllers/botController.js
const Bot = require('../models/Bot');

// Get all bots
exports.getAllBots = async (req, res) => {
  try {
    const bots = await Bot.find({});
    res.json(bots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
};

// Create a new bot
exports.createBot = async (req, res) => {
  try {
    const newBot = new Bot(req.body);
    await newBot.save();
    res.status(201).json(newBot);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create bot' });
  }
};

// Delete a bot
exports.deleteBot = async (req, res) => {
  try {
    const bot = await Bot.findByIdAndDelete(req.params.id);
    if (!bot) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    res.json({ message: 'Bot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bot' });
  }
};