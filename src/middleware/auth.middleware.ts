import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { configEnv } from "../config/env.config";

export const SECRET_KEY: jwt.Secret = configEnv.secret;

interface TokenType {
  id: number;
  email: string;
}
export interface CustomRequest extends Request {
  token: TokenType;
}

export class AuthMiddleware {
  checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new Error();
      }

      const decoded = jwt.verify(token, SECRET_KEY) as TokenType; // Type Assertion
      (req as CustomRequest).token = decoded;

      next();
    } catch (err) {
      res.status(401).send("Please authenticate");
    }
  }
}
