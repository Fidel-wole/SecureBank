import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_SECRET } from "../configs/env";
import { CustomRequest } from "../interface/custom-request";
import UserService from "../services/user";

const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => { 
  const authHeader = req.headers.authorization;

  // Check if authorization header is present
  if (!authHeader) {
    res.status(401).send("Authorization header is missing");  // Set status code and send response
    return;  // Return to stop further execution
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decodedUser = jwt.verify(token, JWT_ACCESS_SECRET!) as JwtPayload;

    // Check if the decoded user exists
    if (!decodedUser) {
      res.status(401).send("Unauthorized");  // Set status code and send response
      return;  // Return to stop further execution
    }
    
    // Attach user information to the request object
    (req as CustomRequest).userId = decodedUser.userId;
    (req as CustomRequest).email = decodedUser.email;
    (req as CustomRequest).panicPin = decodedUser.panicPin

    // Call the next middleware or route handler
    next();
  } catch (err) {
    res.status(500).send("Internal Server Error");  // Set status code and send response
    console.log(err);
    return;  // Return to stop further execution
  }
};

export default authMiddleWare;
