import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import { verifyToken } from "../utils/VerifyToken";

const router = Router();

//what I am working on now
router.post('/admin/add/category', verifyToken, categoryController.saveCategory);
router.get('/admin/category/all', categoryController.getallCategory);
router.delete('/admin/delete/category/:categoryId', verifyToken, categoryController.deleteCategory);
router.put('/admin/edit/category', verifyToken, categoryController.editCategory);

export default router;