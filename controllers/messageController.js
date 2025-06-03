const Message = require('../models/Message');

exports.createMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;

  if (!senderId || !receiverId || !message) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      content: message  // lưu vào trường content trong DB
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Lấy lịch sử tin nhắn giữa 2 user (2 chiều)
exports.getMessagesBetweenUsers = async (req, res) => {
  try {
    const { user1, user2 } = req.query; // lấy từ query param

    if (!user1 || !user2) {
      return res.status(400).json({ message: 'Missing user1 or user2 parameter' });
    }

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 }
      ]
    }).sort({ createdAt: 1 }); // sắp xếp theo thời gian tăng dần

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};