exports.sendVerificationEmail = async (to, verificationToken) => {
  // Thay thế domain bằng domain thật của bạn khi deploy
  const verificationUrl = `http://localhost:3000/employees/setup-account?token=${verificationToken}`;
  // Ở đây chỉ log ra console, thực tế bạn nên dùng nodemailer để gửi email thật
  console.log(`Gửi email xác minh tới ${to}: Nhấn vào link để xác minh tài khoản: ${verificationUrl}`);
  // Nếu dùng nodemailer, hãy gửi email thật ở đây
  return true;
};