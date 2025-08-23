import express from 'express';
const router = express.Router();
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
  getBlogs,
  deleteBlog,
  getDashboardStats, // Added getDashboardStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/users').get(protect, admin, getUsers).post(protect, admin, createUser);
router.route('/users/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUser);
router.route('/blogs').get(protect, admin, getBlogs);
router.route('/blogs/:id').delete(protect, admin, deleteBlog);
router.route('/dashboard-stats').get(protect, admin, getDashboardStats); // New route for dashboard stats

export default router;
