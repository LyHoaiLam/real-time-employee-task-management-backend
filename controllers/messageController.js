// controllers/messageController.js
const Message = require('../models/Message');

/**
 * POST /messages
 * body: { senderId, receiverId, content }
 * Lưu tin nhắn mới và trả về object message đã lưu.
 */
exports.createMessage = async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  if (!senderId || !receiverId || !content) {
    return res.status(400).json({ message: 'senderId, receiverId và content đều bắt buộc.' });
  }
  try {
    const newMessage = await Message.create({ senderId, receiverId, content });
    // TODO: emit qua socket nếu cần (socket.io instance có thể được inject vào controller)
    return res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error creating message:', err);
    return res.status(500).json({ message: 'Lỗi server khi lưu tin nhắn.' });
  }
};

/**
 * GET /messages/:userA/:userB
 * Lấy tất cả tin nhắn giữa userA và userB, sắp xếp theo sentAt
 */
exports.getConversation = async (req, res) => {
  const { userA, userB } = req.params;
  try {
    const convo = await Message.find({
      $or: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA }
      ]
    })
    .sort('sentAt');
    return res.json(convo);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy lịch sử chat.' });
  }
};
