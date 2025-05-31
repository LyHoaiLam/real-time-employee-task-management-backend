const mongoose = require('mongoose')
const accessCodeSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false }
})
module.exports = mongoose.model('AccessCode', accessCodeSchema)