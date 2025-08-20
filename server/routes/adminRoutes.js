import express from 'express';
const router = express.Router();
import {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
  getBlogs,
  deleteBlog,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/users').get(protect, admin, getUsers).post(protect, admin, createUser);
router.route('/users/:id').delete(protect, admin, deleteUser).put(protect, admin, updateUser);
router.route('/blogs').get(protect, admin, getBlogs);
router.route('/blogs/:id').delete(protect, admin, deleteBlog);

export default router;
