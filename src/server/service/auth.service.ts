import { configEnv } from "../../config/env.config";
import { UserModel } from "../db/models/user.model";
import { hashingPassword } from "../utils/util";
import * as jwt from "jsonwebtoken";

export class AuthService {
  async create(user: any): Promise<boolean> {
    try {
      await this.userExist(user.email);
      await UserModel.create(user);

      return true;
    } catch (error) {
      throw error;
    }
  }

  async login(user: any) {
    try {
      const findUser = await this.findUserByEmail(user.email);
      console.log(findUser);
      console.log(findUser.password);
      this.checkPassword(findUser.password, user.password);

      const token = this.generateToken(findUser.id, findUser.email);
      return { token };
    } catch (error) {
      throw error;
    }
  }

  private async findUserByEmail(email: string) {
    try {
      const user = await UserModel.findOne({
        raw: true,
        attributes: ["userId", "email", "password"],
        where: { email },
      });

      if (!user) {
        throw new Error("User not exist.");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  private async userExist(email: string) {
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        throw new Error("User already exist. :(");
      }
      return true;
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
