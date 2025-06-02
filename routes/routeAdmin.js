const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const express = require('express');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const router = express.Router();

/**
 * @swagger
 * /admin/register:
 *   post:
 *     summary: Create new account Admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               username: "admin1"
 *               password: "yourpassword"
 *               email: "admin1@example.com"
 *     responses:
 *       200:
 *         description: Admin account created.
 *       400:
 *         description: Missing required fields or username exists.
 

 * /admin/login:
 *   post:
 *     summary: Login Admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: "admin1"
 *               password: "yourpassword"
 *     responses:
 *       200:
 *         description: Admin login successful.
 *       400:
 *         description: Invalid credentials.
 */

// Tạo tài khoản admin
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password || !email)
    return res.status(400).json({ message: 'Missing required fields.' })

  const existed = await Admin.findOne({ username })
  if (existed) return res.status(400).json({ message: 'Username already exists.' })

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, passwordHash, email })
  await admin.save()
  res.json({ message: 'Admin account created.' })
})

// Đăng nhập admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const admin = await Admin.findOne({ username })
  if (!admin) return res.status(400).json({ message: 'Invalid credentials.' })

  const isMatch = await bcrypt.compare(password, admin.passwordHash)
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' })

  // Tạo JWT, gắn role là 'admin'
  const token = jwt.sign(
    { id: admin._id, username: admin.username, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '1d' }
  )

  res.json({ message: 'Admin login successful.', token });
})

module.exports = router;