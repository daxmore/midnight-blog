import express from 'express';
import { signupUser, signinUser } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
    '/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],
    signupUser
);

router.post(
    '/signin',
    [
        body('email').isEmail().withMessage('Please include a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    signinUser
);

export default router;
