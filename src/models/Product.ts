// models/User.ts
import { Connection, ResultSetHeader } from "mysql2/promise";
import logger from "../config/logger";
import bcrypt from "bcrypt";
import { ProductType } from "types/Product";
import randm from "../utils/randChar";
const fs = require('fs');


class Product {


  static async deleteProduct(
    connection: Connection,
    productId: string,
    file1: string, 
    file2: string, 
    file3: string
  ): Promise<number | null> {
    

      try {
        const result: any = await connection.execute( `DELETE FROM product WHERE id = ?` ,
            [productId]
        );

        fs.unlink(file1, (err1:any) => {
          if (err1) {
          console.error('Error deleting file1:', err1);
          // Handle the error for file1 as needed
          } else {
          console.log('File1 deleted successfully');
      
          // Proceed to delete file2
          fs.unlink( file2, (err2:any) => {
              if (err2) {
              console.error('Error deleting file2:', err2);
              // Handle the error for file2 as needed
              } else {
              console.log('File2 deleted successfully');
      
              // Proceed to delete file3
              fs.unlink( file3, (err3:any) => {
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
    
        if (result && result.length > 0) {
          return result[0];
        } else {
          logger.error('Error deleting product - (/admin/delete/product/:productId)');
          return null;
        }
      } catch (error) {
        logger.error('Error deleting product:', error);
        return null;
      }
  }

    

    //Check if a duplicate product exists
    static async IsExistAProductByName(
        connection: Connection, productName: string
      ): Promise<{status: boolean, message: any, data?: any}> {
          try {
              const existAProduct: any = await connection.execute(
                  `SELECT id, name FROM product  WHERE name = ?`,
                  [productName]
                );
        
                if (existAProduct && existAProduct[0].length > 0) {
                    logger.error('Duplicate product: No result or empty result array');
                  return {
                    status: false,
                    message: "Opps, This product name already exist",
                    data: existAProduct[0].id
                  };
                } else {
                  return {
                    status: true,
                    message: "No duplicate, continue running"
                  };
                }

              } catch (error) {
                logger.error('Duplicate error finding (/admin/product/upload):', error);
                return {
                  status: false,
                  message: error
                };
              }
      }

    static async saveProduct(
      connection: Connection, product: ProductType
    ): Promise<{status: boolean, message: any, data?: any}> {
        try {
            const result: any = await connection.execute(
                `INSERT INTO product (category_id, name, unit_price,  units_in_stock, description, size,  discount_price, label, currency, primary_image_url, hover_image_url, add_to_cart_image_url, sku, active, date_created, last_updated ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1, NOW(), NOW())`,
                [product.productCategory,product.productName, product.productPrice, product.productCount, product.productDescription, product.productSize,  product.discountPrice,  product.productLabel, product.productCurrency, product.primaryImageUrl, product.hoverImgUrl, product.cartImgUrl, randm.generateRandomString(10)]
              );
      
              if (result && result.length > 0) {
                // return result[0].insertId;
                return {
                  status: true,
                  message: "Inserted product successfully",
                  data: result[0].insertId
                };
              } else {
                logger.error('Error inserting product: No result or empty result array (/admin/product/upload)');
                return {
                  status: false,
                  message: "Error inserting product: No result or empty result array"
                };
              }
            } catch (error) {
              logger.error('Error inserting product (/admin/product/upload):', error);
              return {
                status: false,
                message: error
              };
            }
    }


    
}

export default Product;
