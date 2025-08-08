import { NextFunction, Request, Response } from "express";
import * as userService from "../services/userService";
import { logger } from "../winstonLogger/logger";

// Get user by Clerk user ID (from params)
export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const clerkUserId = (req as any).auth?.userId;

  userService
    .getUserById(clerkUserId)
    .then((data) => {
      if (data.user) {
        res.json(data);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {

     logger.error("Error From User Controller" , ` User ID-- ${clerkUserId} ${err.message} `)


         // logger.error("Error From User Controller" , `${err.message}`)

          logger.error({
    method: req.method,
    url: req.originalUrl,
    userAgent: req.headers['user-agent'],
    status: 500,
    message: err.message

  });
  
      next(err)
    
    });
};

// Add user: always use Clerk user ID from session, not from body
export const addUser = (req: Request, res: Response, next: NextFunction) => {
  // ClerkExpressRequireAuth middleware attaches userId to req.auth.userId
  const clerkUserId = (req as any).auth?.userId;
  const { firstName, lastName } = req.body;

  if (!clerkUserId || !firstName || !lastName) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  userService
    .createUser({ id: clerkUserId, firstName, lastName })
    .then((result) => res.status(201).json(result))
    .catch((err) => next(err));
};
