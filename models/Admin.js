const mongoose = require('mongoose')// dùng thư biện mongoose để dịnh nghĩa schema, kết nối BD
const adminSchema = new mongoose.Schema({ //Tạo một Schema cho bảng (collection) Admin.
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }, //hứa mật khẩu đã được mã hóa bằng bcrypt (không lưu mật khẩu gốc)
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, default: 'admin' }
})
module.exports = mongoose.model('Admin', adminSchema) //Tạo model tên là Admin từ adminSchema.

// unique là không cho trùng trong DB


// const Admin = require('./models/Admin');
// const newAdmin = new Admin({
//   username: 'admin1',
//   passwordHash: 'abc1234Hashed',
//   email: 'admin1@example.com'
// });
// await newAdmin.save();
