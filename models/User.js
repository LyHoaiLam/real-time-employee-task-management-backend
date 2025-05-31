const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'User' },
  isVerified: { type: Boolean, default: false },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('User', userSchema);
