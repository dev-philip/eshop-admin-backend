//Middleware for Token Verification
import logger from '../config/logger';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import moment from 'moment';

// Extend the Request type to include the 'user' property
interface AuthenticatedRequest extends Request {
    user?: any; // Adjust the type of 'user' based on your requirements
}
  
const verifyToken = (req:AuthenticatedRequest, res:Response , next:NextFunction ) => {
    const tokenWithBearer = req.headers['authorization'];
    if (!tokenWithBearer) {
        return res.status(403).json({ message: 'Unauthorized Access - Token not provided' });
      }
    const tokenArray = tokenWithBearer.split(' ');
    const token = tokenArray[1];

    const secretKey: string | undefined = process.env.SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({ message: 'Internal Server Error: Secret key not configured' });
    }
  
    jwt.verify(token, secretKey, (err:any, decoded:any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized Access - Invalid token' });
      }
      req.user = decoded;
      next();
    });
  };

  const generateTokens = (user: {email: string}): { accessToken: string; accessTokenExpiresIn: string} => {
    const SECRET_KEY: string | undefined = process.env.SECRET_KEY;
    const JWT_EXPIRE: string | undefined = process.env.JWT_EXPIRE;
    const REFRESH_TOKEN_EXPIRE: string | undefined = process.env.JWT_EXPIRE;
  
    if (!SECRET_KEY || !JWT_EXPIRE || !REFRESH_TOKEN_EXPIRE) {
      logger.error(`Internal Server Error: ENV data not loaded or configured`);
      throw new Error('Internal Server Error: ENV data not loaded or configured');
    }
  
    const accessToken = jwt.sign({ username: user }, SECRET_KEY, { expiresIn: JWT_EXPIRE });
        //calculate token expirationTime
        const currentTime = moment();
        const newTime = currentTime.add(JWT_EXPIRE.slice(0, -1), 'minutes');
        const expirationTime = newTime.format('YYYY-MM-DD h:mm:ss a');
  
    return { 
        accessToken,
        accessTokenExpiresIn : expirationTime
    };
  };
  

export { generateTokens, verifyToken };
