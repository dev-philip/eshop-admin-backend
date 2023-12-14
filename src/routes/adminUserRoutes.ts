import { Router } from 'express';
import adminUserController from '../controllers/AdminUserController';
import { verifyToken } from "../utils/VerifyToken";

const router = Router();

// Define your routes
router.post('/admin/register', adminUserController.createAdminUser);
router.post('/admin/login', adminUserController.loginAdminUser);
router.get('/admin/all', verifyToken, adminUserController.getallAdminUsers);

export default router;