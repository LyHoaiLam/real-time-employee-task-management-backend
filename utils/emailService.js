const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendVerificationEmail = async (to, verificationToken) => {
  const verificationUrl = `http://localhost:3001/setUserAccount?token=${verificationToken}`; // Chú ý cổng 3002 và url frontend mới

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Xác thực tài khoản nhân viên',
    html: `<p>Click vào link dưới để thiết lập tài khoản:</p><a href="${verificationUrl}">${verificationUrl}</a>`
  };

  await transporter.sendMail(mailOptions);
}
