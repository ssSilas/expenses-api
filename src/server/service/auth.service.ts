import { configEnv } from "config/enviroments";
import { UserModel } from "../db/models/user.model";
import { hashingPassword } from "../utils/util";
import * as jwt from "jsonwebtoken";

export class AuthService {
  async create(user: any): Promise<boolean> {
    try {
      await this.findUserByEmail(user.email);
      await UserModel.create(user);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      const findUser = await this.findUserByEmail(user.email);
      this.checkPassword(findUser.password, user.password);

      const token = this.generateToken(findUser.id, findUser.email);
      return token;
    } catch (error) {
      throw error;
    }
  }

  private findUserByEmail(email: string) {
    try {
      const user = UserModel.findOne({
        attributes: ["id", "email", "password"],
        where: { email },
      });

      if (!user) {
        throw new Error("Name of user is not correct");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  private checkPassword(hashedPass: string, rawPass: string) {
    const hashRaw = hashingPassword(rawPass);
    const check = hashRaw === hashedPass;

    if (!check) {
      throw new Error("Password is not correct");
    }
    return true;
  }

  private generateToken(userId: number, email: string) {
    const payload = { userId, email };
    const secretKey = configEnv.secret;
    const tokexExpires = configEnv.expireToken;
    const token = jwt.sign(payload, secretKey, { expiresIn: tokexExpires });
    return token;
  }
}
