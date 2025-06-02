const express = require('express');
const router = express.Router();
const AccessCode = require('../models/AccessCode');

/**
 * @swagger
 * components:
 *   schemas:
 *     AccessCodeRequest:
 *       type: object
 *       properties:
 *         phoneNumber:
 *           type: string
 *       example:
 *         phoneNumber: "0362685068"


 * /access-code:
 *   post:
 *     summary: Send accessCode to PhoneNumber
 *     tags: [AccessCode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccessCodeRequest'
 *     responses:
 *       200:
 *         description: Access code sent.
 *       400:
 *         description: Phone number is required.

 * /access-code/verify:
 *   post:
 *     summary: Authenticate accesCode
 *     tags: [AccessCode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               code:
 *                 type: string
 *             example:
 *               phoneNumber: "0362685068"
 *               code: "123456"
 *     responses:
 *       200:
 *         description: Access code is valid
 *       400:
 *         description: Invalid or expired access code
 */

function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Route nhận phoneNumber, tạo accessCode và gửi SMS (chỉ log ra console)
router.post('/', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ message: 'Phone number is required.' })

  const code = generateAccessCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

  try {
    // Lưu hoặc cập nhật accessCode cho số điện thoại này
    await AccessCode.findOneAndUpdate(
      { phoneNumber },
      { $set: { code, expiresAt, createdAt: new Date(), verified: false } },
      { upsert: true, new: true }
    )

    // Gửi SMS log ra console
    console.log(`Gửi mã xác thực ${code} tới số điện thoại (mở console trong BE lên xem) ${phoneNumber}`)
    res.json({ message: 'Access code sent.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Route xác thực access code
router.post('/verify', async (req, res) => {
  const { phoneNumber, code } = req.body
  if (!phoneNumber || !code) {
    return res.status(400).json({ message: 'Phone number and code are required.' })
  }

  try {
    const accessCode = await AccessCode.findOne({ phoneNumber, code })
    if (!accessCode || accessCode.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired access code.' })
    }

    accessCode.verified = true
    await accessCode.save()

    res.json({ message: 'Access code is valid.' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router;