
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: API quản lý tin nhắn giữa 2 user
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: receive messages from 2 users
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: user1
 *         schema:
 *           type: string
 *         required: true
 *         description: ID user thứ nhất
 *       - in: query
 *         name: user2
 *         schema:
 *           type: string
 *         required: true
 *         description: ID user thứ hai
 *     responses:
 *       200:
 *         description: Danh sách tin nhắn giữa 2 user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       400:
 *         description: Thiếu tham số user1 hoặc user2
 *       500:
 *         description: Lỗi server
 * 
 *   post:
 *     summary: Send message 2 user
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderId
 *               - receiverId
 *               - message
 *             properties:
 *               senderId:
 *                 type: string
 *                 description: ID người gửi
 *               receiverId:
 *                 type: string
 *                 description: ID người nhận
 *               message:
 *                 type: string
 *                 description: Nội dung tin nhắn
 *     responses:
 *       201:
 *         description: Tin nhắn đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Thiếu trường dữ liệu
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - senderId
 *         - receiverId
 *         - content
 *         - createdAt
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của tin nhắn
 *         senderId:
 *           type: string
 *           description: ID người gửi
 *         receiverId:
 *           type: string
 *           description: ID người nhận
 *         content:
 *           type: string
 *           description: Nội dung tin nhắn
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Thời gian tạo tin nhắn
 */


// Lấy tin nhắn giữa 2 user
router.get('/', async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) {
      return res.status(400).json({ error: 'Missing user1 or user2 parameter' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tạo tin nhắn mới
router.post('/', async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      content: message
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
