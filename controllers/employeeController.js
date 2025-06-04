const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../utils/emailService');
const Employee = require('../models/Employee');
const User = require('../models/User');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-passwordHash -verificationToken -verificationTokenExpires')
    res.json(employees)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .select('-passwordHash -verificationToken -verificationTokenExpires');

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.json({ employee });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createEmployee = async (req, res) => {
  const verificationToken = crypto.randomBytes(32).toString('hex')
  //Thời hạn hiệu lực của mã xác minh: hiện tại + 24 giờ. Dùng đơn vị milliseconds vì Date.now() trả về thời gian tính bằng ms.
  const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24h

  const employee = new Employee({ // Tạo object từ model Employee
    name: req.body.name,
    position: req.body.position,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    role: req.body.role,
    verificationToken,
    verificationTokenExpires
  })

  try {
    const newEmployee = await employee.save(); //Lưu đối tượng employee vào MongoDB.
    // Gọi service gửi email (emailService) để gửi mã xác minh đến email nhân viên mới.
    await emailService.sendVerificationEmail(newEmployee.email, verificationToken)

    res.status(201).json({ 
      message: 'Employee created. Verification email sent.',
      token: verificationToken
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}


exports.setupAccount = async (req, res) => {
  const { token, username, password } = req.body

  try {
    const employee = await Employee.findOne({ 
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
      isVerified: false
    })
    if (!employee) {
      return res.status(400).json({ message: 'Invalid or expired token.' })
    }

    const existed = await User.findOne({ username })
    if (existed) {
      return res.status(400).json({ message: 'Username already taken.' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({
      username,
      passwordHash,
      role: employee.role,
      isVerified: true,
      employeeId: employee._id
    })
    await user.save()

    employee.isVerified = true
    employee.username = username
    employee.verificationToken = undefined
    employee.verificationTokenExpires = undefined
    await employee.save()

    const jwtToken = jwt.sign({
      id: user._id,
      username: user.username,
      role: user.role,
      employeeId: employee._id
    }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.json({ message: 'Account setup successful. You can now login.', token: jwtToken })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


// exports.deleteEmployee = async (req, res) => {
//   try {
//     const { id } = req.params
//     const deleted = await Employee.findByIdAndDelete(id)

//     if (!deleted) {
//       return res.status(404).json({ message: 'Employee not found' })
//     }
//     res.json({ message: 'Employee deleted successfully' })
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message })
//   }
// }

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    await Employee.findByIdAndDelete(id);
    await User.findOneAndDelete({ username: employee.username });
    res.json({ message: 'Employee and associated user deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.updateEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id; //Xác định nhân viên cần cập nhật thông qua req.params.id
    const updateData = req.body;//Nhận dữ liệu mới từ req.body

    // if (updateData.task && typeof updateData.task.status === 'string') {
    //   updateData.task = { status: updateData.task.status };
    // }
    const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
    }

    res.json({ message: 'Cập nhật thành công', employee: updatedEmployee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

