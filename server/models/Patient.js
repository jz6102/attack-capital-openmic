const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String },
  location: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Patient', EmployeeSchema); // Keep model name to avoid more changes