import { Request } from "express";
import { configEnv } from "../../config/env.config";
import { hashingPassword } from "../utils/util";
import * as jwt from "jsonwebtoken";

export const SECRET_KEY: jwt.Secret = "your-secret-key-here";

export interface CustomRequest extends Request {
  token: string | jwt.JwtPayload;
}

export class JwtService {
  checkPassword(hashedPass: string, rawPass: string) {
    const hashRaw = hashingPassword(rawPass);
    const check = hashRaw === hashedPass;

    if (!check) {
      throw new Error("Password is not correct");
    }
    return true;
  }

  generateToken(id: number, email: string) {
    const payload = { id, email };
    const secretKey = configEnv.secret;
    const tokexExpires = configEnv.expireToken;
    const token = jwt.sign(payload, secretKey, { expiresIn: tokexExpires });
    return token;
  }
}
