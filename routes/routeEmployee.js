const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authenticateJWT = require('../middlewares/authenticateJWT')
/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Server error
 *
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         position:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *         username:
 *           type: string
 *         isVerified:
 *           type: boolean
 *         verificationToken:
 *           type: string
 *         verificationTokenExpires:
 *           type: string
 *       example:
 *         _id: "64ab1234f5678abcd9012345"
 *         name: "Nguyễn Văn A"
 *         position: "Developer"
 *         email: "nguyenvana@example.com"
 *         phoneNumber: "0123456789"
 *         role: "User"
 *         username: "nguyenvana"
 *         isVerified: false
 *         verificationToken: "randomtoken"
 *         verificationTokenExpires: "2025-05-29T12:00:00.000Z"
 *     EmployeeInput:
 *       type: object
 *       required:
 *         - name
 *         - position
 *         - email
 *         - phoneNumber
 *         - role
 *       properties:
 *         name:
 *           type: string
 *         position:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *       example:
 *         name: "Nguyễn Văn A"
 *         position: "Developer"
 *         email: "nguyenvana@example.com"
 *         phoneNumber: "0123456789"
 *         role: "User"
 */

// Các route CRUD chính ở đây (ví dụ: router.post('/', employeeController.createEmployee); ...)

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee and send verification email
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Employee created. Verification email sent.
 *       400:
 *         description: Bad request
 *
 * /employees/setup-account:
 *   post:
 *     summary: Set up employee account from verification email
 *     tags: [Employee]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account setup successful
 *       400:
 *         description: Invalid or expired token
 *

 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID to delete
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       401:
 *         description: Unauthorized, token missing or invalid
 *       403:
 *         description: Forbidden, only admins can delete
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */

router.delete('/:id', employeeController.deleteEmployee);
router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/setup-account', employeeController.setupAccount);
router.put('/:id', authenticateJWT, employeeController.updateEmployee);
router.post('/', employeeController.createEmployee);
router.get('/test', (req, res) => {
  res.json({ message: 'Employee API is working!' });
});

module.exports = router;