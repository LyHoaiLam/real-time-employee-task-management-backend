const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: { type: Date },
  // task: {
  //   status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  // }

}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
