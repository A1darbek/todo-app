const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { check, validationResult } = require('express-validator');
const taskService = require('../services/taskService');
const authMiddleware = require('../middleware/authMiddleware');

const taskController = new TaskController(taskService)

// Validation middleware for creating a task
const createTaskValidation = [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description must be a string').optional().isString()
];

// Routes for task management
router.post('/tasks', authMiddleware, createTaskValidation, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    taskController.createTask(req, res, next);
});
router.get('/tasks', authMiddleware, taskController.getTasks);

// Validation middleware for updating a task
const updateTaskValidation = [
    check('title', 'Title must not be empty if provided').optional().notEmpty(),
    check('description', 'Description must be a string').optional().isString(),
    check('completed', 'Completed must be a boolean').optional().isBoolean()
];
router.put('/tasks/:id', authMiddleware, updateTaskValidation, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    taskController.updateTask(req, res, next);
});
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

module.exports = router;