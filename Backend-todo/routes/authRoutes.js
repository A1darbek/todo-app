const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authService = require('../services/authService');
const { check, validationResult } = require('express-validator');

const authController = new AuthController(authService)

// Validation middleware for registration
const registerValidation = [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength( { min: 6 } )
]

router.post('/register', registerValidation , (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Send back a list of all validation errors
        return res.status(400).json({ errors: errors.array() });
    }
    authController.register(req, res, next)
})

// Validation middleware for login
const loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
];


router.post('/login', loginValidation, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // Return detailed validation errors to the client
        return res.status(400).json({ errors: errors.array() });
    }
    authController.login(req, res, next)
})

router.post('/google-login', (req, res, next) => {
    authController.googleLogin(req, res, next);
});

module.exports = router;