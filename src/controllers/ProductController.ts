import { Request, Response } from 'express';
import logger from '../config/logger';
import DatabaseConnectionManager from '../config/databaseConnectionManager';
import Product from '../models/Product';
import { socketIo } from '../app';
const fs = require('fs');




class ProductController {

    async deleteProduct(req: Request, res: Response): Promise<void> {
        const { id, primaryImage, cartImage, hoverImage,  ...extraFields } = req.body;

        if (Object.keys(extraFields).length > 0) {
            res.status(400).json({ error: 'Invalid data passed to the request body' });
            return;
          }

          const file1 = "public/" +primaryImage;
          const file2 =  "public/" +cartImage;
          const file3 =  "public/" +hoverImage;
          
    
        const deleteCategoryResponse = await Product.deleteProduct(DatabaseConnectionManager.getInstance().getPool(), id, file1, file2, file3);
    
        if (deleteCategoryResponse === null) {
          logger.error("(Controller )Error deleting category (/admin/delete/product/:productId)");
          res.status(400).json({ message: "(Controller )Error deleting category (/admin/delete/product/:productId)" });
        } 
        else {
          res.status(200).json(deleteCategoryResponse);
        }
      }

    

  async saveProduct(req: any, res: any): Promise<void> {

    const { productName, productPrice, productCount, discountPrice, productCategory, productSize, productCurrency, productLabel, productDescription,  ...extraFields } = req.body;

     // Check if there are any extra fields
    if (Object.keys(extraFields).length > 0) {
      res.status(400).json({ error: 'Invalid data passed to the request body' });
      return;
    }


    if (!req.files) {
        res.status(400).send({ error: 'No files uploaded.' });
        return;
    }
    
    // Assuming you are using 'file1', 'file2', and 'file3' as field names
    const file1Path = req.files['file1'][0].path.replace(/\\/g, '/').replace(/^public\//, '');
    const file2Path = req.files['file2'][0].path.replace(/\\/g, '/').replace(/^public\//, '');
    const file3Path = req.files['file3'][0].path.replace(/\\/g, '/').replace(/^public\//, '');

    const product = {
        productName, 
        productPrice: parseInt(productPrice, 10), 
        productCount: parseInt(productCount, 10), 
        discountPrice:  parseInt(discountPrice, 10), 
        productCategory : parseInt(productCategory, 10),
        productSize, 
        productCurrency, 
        productLabel, 
        productDescription,
        primaryImageUrl: file1Path,
        cartImgUrl: file2Path,
        hoverImgUrl: file3Path
    }

    const isProductExist = await Product.IsExistAProductByName(DatabaseConnectionManager.getInstance().getPool(), productName );

    if (isProductExist.status === false){  //there is a duplicate category
        res.status(200).json( isProductExist );

        // Use fs.unlink to delete each file
        fs.unlink(`public/${file1Path}`, (err1:any) => {
            if (err1) {
            console.error('Error deleting file1:', err1);
            // Handle the error for file1 as needed
            } else {
            console.log('File1 deleted successfully');
        
            // Proceed to delete file2
            fs.unlink( `public/${file2Path}`, (err2:any) => {
                if (err2) {
                console.error('Error deleting file2:', err2);
                // Handle the error for file2 as needed
                } else {
                console.log('File2 deleted successfully');
        
                // Proceed to delete file3
                fs.unlink( `public/${file3Path}`, (err3:any) => {
                    if (err3) {
                    console.error('Error deleting file3:', err3);
                    // Handle the error for file3 as needed
                    } else {
                    console.log('File3 deleted successfully');
                    // All files deleted successfully
                    }
                });
                }
            });
            }
        });
        return;
    }else{
        const productResponse = await Product.saveProduct(DatabaseConnectionManager.getInstance().getPool(), product);

        if (productResponse.status === true) {
    
        // Notify connected clients about the new product
        socketIo.emit('Product', { message: 'New Product is available. Reload page to get latest update' });
            res.status(200).json( productResponse );
        } else {
            res.status(200).json({ status:false, error: 'Failed to create product' });
            
        // Use fs.unlink to delete each file
        fs.unlink(`public/${file1Path}`, (err1:any) => {
            if (err1) {
            console.error('Error deleting file1:', err1);
            // Handle the error for file1 as needed
            } else {
            console.log('File1 deleted successfully');
        
            // Proceed to delete file2
            fs.unlink( `public/${file2Path}`, (err2:any) => {
                if (err2) {
                console.error('Error deleting file2:', err2);
                // Handle the error for file2 as needed
                } else {
                console.log('File2 deleted successfully');
        
                // Proceed to delete file3
                fs.unlink( `public/${file3Path}`, (err3:any) => {
                    if (err3) {
                    console.error('Error deleting file3:', err3);
                    // Handle the error for file3 as needed
                    } else {
                    console.log('File3 deleted successfully');
                    // All files deleted successfully
                    }
                });
                }
            });
            }
        });
        }

    }
    
 

    }


}

export default new ProductController();