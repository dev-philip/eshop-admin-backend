import { Request, Response } from 'express';
import logger from '../config/logger';
import DatabaseConnectionManager from '../config/databaseConnectionManager';
import Category from '../models/Category';
import { socketIo } from '../app';

class categoryController {

    async deleteCategory(req: Request, res: Response): Promise<void> {
        const categoryId = req.params.categoryId;

        if(!categoryId || categoryId === null){
            res.status(400).json({message: "(ID) not provided" })
            return;
        }
    
        const deleteCategoryResponse = await Category.deleteCategory(DatabaseConnectionManager.getInstance().getPool(), categoryId);
    
        if (deleteCategoryResponse === null) {
          logger.error("(Controller )Error deleting category (/admin/delete/category/:categoryId)");
          res.status(400).json({ message: "(Controller )Error deleting category (/admin/delete/category/:categoryId)" });
        } 
        else {
          res.status(200).json(deleteCategoryResponse);
        }
      }

  async getallCategory(req: Request, res: Response): Promise<void> {
    
    const getCategoryResponse = await Category.getallCategory(DatabaseConnectionManager.getInstance().getPool());

    if (getCategoryResponse === null) {
      res.status(400).json({ message: "Error getting category (Get)" });
    } 
    else {
      res.status(200).json(getCategoryResponse);
    }
  }



  async saveCategory(req: Request, res: Response): Promise<void> {

    const { product_category, ...extraFields } = req.body;
    // Check if there are any extra fields
    if (Object.keys(extraFields).length > 0) {
      res.status(400).json({ error: 'Invalid data passed to the request body' });
      return;
    }

    const isCategoryExist = await Category.IsExistACategory(DatabaseConnectionManager.getInstance().getPool(), product_category );

    if (isCategoryExist.status === false){  //there is a duplicate category
        res.status(200).json( isCategoryExist );
        return;
    }else{

        const categoryResponse = await Category.saveCategory(DatabaseConnectionManager.getInstance().getPool(), product_category );

        if (categoryResponse.status === true) {

            // Notify connected clients about the new product
        socketIo.emit('category', { message: 'New category is available. Reload page to get latest update' });
        res.status(200).json( categoryResponse );
        } else {
        res.status(200).json({ error: 'Failed to insert category' });
        }


    }
  }


  async editCategory(req: Request, res: Response): Promise<void> {

    const { product_category, categoryId, ...extraFields } = req.body;

    // Check if there are any extra fields
    if (Object.keys(extraFields).length > 0) {
      res.status(400).json({ error: 'Invalid data passed to the request body' });
      return;
    }

    const isCategoryExist = await Category.IsExistACategory(DatabaseConnectionManager.getInstance().getPool(), product_category );
    

    if (isCategoryExist.status === false){  //there is a duplicate category
        res.status(200).json( isCategoryExist );
        return;
    }else{

        const editCategoryResponse = await Category.editCategory(DatabaseConnectionManager.getInstance().getPool(), product_category, categoryId );

        if (editCategoryResponse.status === true) {
        res.status(200).json( editCategoryResponse );
        } else {
        res.status(200).json({ error: 'Failed to insert category' });
        }


    }
   
    
  }
}

export default new categoryController();