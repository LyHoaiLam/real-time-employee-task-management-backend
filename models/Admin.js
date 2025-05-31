const mongoose = require('mongoose')
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: 'admin' }
})
module.exports = mongoose.model('Admin', adminSchema)