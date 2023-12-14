// models/User.ts
import { Connection, ResultSetHeader } from "mysql2/promise";
import logger from "../config/logger";
import bcrypt from "bcrypt";

class AdminUser {

  static async getUserByEmail(
    connection: Connection,
    email: string,
  ): Promise<{firstName: string, lastName: string, email: string, password: string}[] | null> {
      try {

        const result: any = await connection.execute(
          `SELECT firstName, lastName, email, password FROM admin_users WHERE email = ?`,
          [email]
        );

        if (result && result[0].length > 0) { //query successfully ran
          return result[0];
        } else {
          logger.error("Error finding user : User not found. No result or empty result array");
          return null;
        }
      } catch (error) {
        logger.error("Error finding user :", error);
        return null;
      }
    }

  static async create(
    connection: Connection, 
    firstName: string, 
    lastName: string, 
    email: string, 
    password: string
  ): Promise<{status: boolean, message: any, data?: any}> {
      try {

        // Check if the user with the provided email already exists
        const existingUserResult: any = await connection.execute(
            `SELECT id FROM admin_users WHERE email = ?`,
            [email]
        );

        if (existingUserResult && existingUserResult[0].length > 0) {
            // User with the provided email already exists, handle accordingly
            logger.error('User with this email already exists');
            return {
              status: false,
              message: "User with this email already exists"
            };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the saltRounds as needed
        const result: any = await connection.execute(
          `INSERT INTO admin_users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`,
          [firstName, lastName, email, hashedPassword]
        );

        if (result && result.length > 0) {
          // return result[0].insertId;
          return {
            status: true,
            message: "Admin user created successfully",
            data: result[0].insertId
          };
        } else {
          logger.error('Error creating user: No result or empty result array');
          return {
            status: false,
            message: "Error creating user: No result or empty result array"
          };
        }
      } catch (error) {
        logger.error('Error creating user:', error);
        return {
          status: false,
          message: error
        };
      }
    }

    static async getallAdminUsers(
      connection: Connection
    ): Promise<number | null> {
        try {
          const result: any = await connection.execute( `SELECT * FROM admin_users`);
      
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
}

export default AdminUser;
