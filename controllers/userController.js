const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

exports.login = async (req, res) => {

  const { username, password } = req.body

  try {
    const user = await User.findOne({ username })
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid credentials or account not verified.' })
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' })
    }
    const employee = await Employee.findOne({ username: user.username })

    let token = jwt.sign({
        id: user._id,
        employeeId: employee ? employee._id : null,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({ message: 'Login successful.', token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.logout = async (req, res) => {
  res.json({ message: 'Logout successful.' })
}
