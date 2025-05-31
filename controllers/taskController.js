const Task = require('../models/taskModel');
const Employee = require('../models/Employee');

exports.createTask = async (req, res) => {
  const { title, description, assignedTo, status, dueDate } = req.body;

  if (!title || !description || !assignedTo || !dueDate) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ: title, description, assignedTo, dueDate.' });
  }

  try {
    // Tạo task mới
    const newTask = new Task({
      title,
      description,
      assignedTo,
      status: status || 'pending',
      dueDate
    });

    await newTask.save();

    // Cập nhật mảng tasks của employee
    await Employee.findByIdAndUpdate(assignedTo, { $push: { tasks: newTask._id } });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Lỗi tạo task:', error);
    res.status(500).json({ message: 'Lỗi server khi tạo task.' });
  }
};
