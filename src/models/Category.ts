// models/User.ts
import { Connection, ResultSetHeader } from "mysql2/promise";
import logger from "../config/logger";
import bcrypt from "bcrypt";

class Category {

    static async deleteCategory(
        connection: Connection,
        categoryId : string
      ): Promise<number | null> {
          try {
            const result: any = await connection.execute( `DELETE FROM product_category WHERE id = ?` ,
                [categoryId]
            );
        
            if (result && result.length > 0) {
              return result[0];
            } else {
              logger.error('Error deleting category - (/admin/delete/category/:categoryId)');
              return null;
            }
          } catch (error) {
            logger.error('Error deleting category:', error);
            return null;
          }
      }
    

    static async getallCategory(
        connection: Connection
      ): Promise<number | null> {
          try {
            const result: any = await connection.execute( `SELECT * FROM product_category`);
        
            if (result && result.length > 0) {
              return result[0];
            } else {
              logger.error('Error fetching admin users');
              return null;
            }
          } catch (error) {
            logger.error('Error fetching admin users:', error);
            return null;
          }
      }
      

    //Check if a duplicate category exists
    static async IsExistACategory(
        connection: Connection, product_category: string
      ): Promise<{status: boolean, message: any, data?: any}> {
          try {
              const existACategory: any = await connection.execute(
                  `SELECT id, category_name FROM product_category  WHERE category_name = ?`,
                  [product_category]
                );
        
                if (existACategory && existACategory[0].length > 0) {
                    logger.error('Duplicate category: No result or empty result array');
                  return {
                    status: false,
                    message: "Opps, This category already exist",
                    data: existACategory[0].id
                  };
                } else {
                  return {
                    status: true,
                    message: "No duplicate, continue running"
                  };
                }

              } catch (error) {
                logger.error('Duplicate error finding (/admin/add/category):', error);
                return {
                  status: false,
                  message: error
                };
              }
      }

    static async saveCategory(
      connection: Connection, product_category: string
    ): Promise<{status: boolean, message: any, data?: any}> {
        try {
            const result: any = await connection.execute(
                `INSERT INTO product_category (category_name, date_created, last_updated) VALUES (?, NOW(), NOW())`,
                [product_category]
              );
      
              if (result && result.length > 0) {
                // return result[0].insertId;
                return {
                  status: true,
                  message: "Inserted category successfully",
                  data: result[0].insertId
                };
              } else {
                logger.error('Error inserting category: No result or empty result array (/admin/add/category)');
                return {
                  status: false,
                  message: "Error inserting category: No result or empty result array"
                };
              }
            } catch (error) {
              logger.error('Error inserting category (/admin/add/category):', error);
              return {
                status: false,
                message: error
              };
            }
    }


    static async editCategory(
        connection: Connection, product_category: string, categoryId: string
      ): Promise<{status: boolean, message: any, data?: any}> {
          try {
            const result: any = await connection.execute(
                'UPDATE product_category SET category_name = ?, last_updated = NOW() WHERE id = ?',
                [product_category, categoryId]
              );
        
                if (result && result.length > 0) {
                  // return result[0].insertId;
                  return {
                    status: true,
                    message: "Updated category successfully",
                    data: result[0].affectedRows
                  };
                } else {
                  logger.error('Error Updating category: No result or empty result array (/admin/edit/category)');
                  return {
                    status: false,
                    message: "Error Updating category: No result or empty result array"
                  };
                }
              } catch (error) {
                logger.error('Error Updating category (/admin/edit/category):', error);
                return {
                  status: false,
                  message: error
                };
              }
      }
}

export default Category;
