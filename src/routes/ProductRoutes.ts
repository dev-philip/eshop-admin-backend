import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { verifyToken } from "../utils/VerifyToken";
const multer  = require('multer')
const path = require('path');



const storage = multer.diskStorage({
    destination: (req:any, file:any, cb:any) => {
      cb(null, 'public/uploads/'); // Destination folder for uploaded files
    },
    filename: (req:any, file:any, cb:any) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });
const router = Router();

//what I am working on now
router.post('/admin/product/upload', verifyToken, upload.fields([{ name: 'file1' }, { name: 'file2' }, { name: 'file3' }]), ProductController.saveProduct);
router.post('/admin/delete/product', verifyToken, ProductController.deleteProduct);



// router.get('/admin/category/all', categoryController.getallCategory);

// router.put('/admin/edit/category', verifyToken, categoryController.editCategory);

export default router;