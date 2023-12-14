import { Request, Response } from 'express';
import logger from '../config/logger';
import DatabaseConnectionManager from '../config/databaseConnectionManager';
import AdminUser from '../models/AdminUser';
import bcrypt from "bcrypt";
import Joi from 'joi';
import { generateTokens } from "../utils/VerifyToken";
import moment from 'moment';

class AdminUserController {

  async loginAdminUser(req: Request, res: Response): Promise<void> {
    const { email, password, ...extraFields } = req.body;

    // Check if there are any extra fields
    if (Object.keys(extraFields).length > 0) {
      res.status(400).json({ error: 'Invalid data passed to the request body' });
      return;
    }

    // Validation schema for the request body
    const loginSchema = Joi.object({
      email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address.',
        'any.required': 'Email is required.',
      }),
      password: Joi.string().required().messages({
        'any.required': 'Password is required.',
      }),
    });

    const { error, value } = loginSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      res.status(200).json({status: false, message: error.details[0].message });
      return;
    }

    const getUserByEmail: {firstName:string, lastName:string, email: string, password:string}[] | null = await AdminUser.getUserByEmail(DatabaseConnectionManager.getInstance().getPool(), email);

    if (getUserByEmail === null) { //invalid email
      res.status(200).json({status: false, message: "Invalid email or password (Invalid Email)" });
      return;
    }

    //check for password now
    try {
      // Use bcrypt to compare the provided password with the stored hashed password
      const passwordCheck = await bcrypt.compare(password, getUserByEmail[0].password);
  
      if (passwordCheck) { // Passwords match
          // If authentication is successful, generate a JWT
          const user = {firstName: getUserByEmail[0].firstName, lastName: getUserByEmail[0].lastName, email: email }
          const token = generateTokens(user);

          res.json({ 
            status: true,
            message: "Login Successful",
            time: moment().format('YYYY-MM-DD h:mm:ss a'),
            token 
          });
      } else {
        // Passwords do not match
        res.status(200).json({ status: false, message: 'Invalid email or password (Password)' });
      }
    } catch (error) {
      // Handle bcrypt error
      logger.error('Error comparing passwords:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

  }

  async createAdminUser(req: Request, res: Response): Promise<void> {
    const { firstName, lastName, email, password, ...extraFields } = req.body;

    // Check if there are any extra fields
    if (Object.keys(extraFields).length > 0) {
      res.status(400).json({ error: 'Invalid data passed to the request body' });
      return;
    }

    // Validation schema for the request body
    const registerSchema = Joi.object({
      firstName: Joi.string().required().messages({
        'any.required': 'Firstname is required boy.',
      }),
      lastName: Joi.string().required().messages({
        'any.required': 'Lastname is required.',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Please enter a valid email address.',
        'any.required': 'Email is required.',
      }),
      password: Joi.string().required().messages({
        'any.required': 'Password is required.',
      }),
    });

    const { error, value } = registerSchema.validate(req.body);

    // Check for validation errors
    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const adminUserResponse = await AdminUser.create(DatabaseConnectionManager.getInstance().getPool(), firstName, lastName, email,  password);

    if (adminUserResponse.status === true) {
      res.status(200).json({ status: adminUserResponse.status, message: adminUserResponse.message, data: adminUserResponse.data });
    } 
    else {
      res.status(200).json({ status: adminUserResponse.status, message: adminUserResponse.message });
    }
  }

  async getallAdminUsers(req: Request, res: Response): Promise<void> {
   
    const adminUsers = await AdminUser.getallAdminUsers(DatabaseConnectionManager.getInstance().getPool());

    if (adminUsers !== null) {
      res.status(200).json({ adminUsers });
    } else {
      res.status(500).json({ error: 'Failed to fetch admin users' });
    }
  }
}

export default new AdminUserController();