const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {

  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {

    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token không hợp lệ.' })
      }
      req.user = user
      next()
    })
  } else {
    res.status(401).json({ message: 'Bạn cần đăng nhập để truy cập.' })
  }
}

module.exports = authenticateJWT
