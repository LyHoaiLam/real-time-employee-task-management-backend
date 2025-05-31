// routes/messages.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Gửi tin nhắn mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [senderId, receiverId, content]
 *             properties:
 *               senderId:
 *                 type: string
 *               receiverId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tin nhắn được lưu thành công
 *       400:
 *         description: Thiếu tham số
 *       500:
 *         description: Lỗi server
 */
router.post('/', messageController.createMessage);

/**
 * @swagger
 * /messages/{userA}/{userB}:
 *   get:
 *     summary: Lấy lịch sử chat giữa hai user
 *     parameters:
 *       - in: path
 *         name: userA
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: userB
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Mảng tin nhắn
 *       500:
 *         description: Lỗi server
 */
router.get('/:userA/:userB', messageController.getConversation);

module.exports = router;
