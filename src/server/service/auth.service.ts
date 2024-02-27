import { UserModel } from "../db/models/user.model";
import {
  CreateUser,
  DataUserExist,
  LoginData,
} from "../interface/auth.interface";
import { JwtService } from "./jwt.service";

export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async login(user: LoginData): Promise<{ token: string }> {
    try {
      const findUser = await this.findUserByEmail(user.email);
      this.jwtService.checkPassword(findUser.password, user.password);

      const token = this.jwtService.generateToken(findUser.id, findUser.email);
      return { token };
    } catch (error) {
      throw error;
    }
  }
  async create(user: CreateUser): Promise<boolean> {
    try {
      await this.userExist(user.email);
      await UserModel.create({ ...user });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<DataUserExist> {
    try {
      const user = await UserModel.findOne({
        raw: true,
        attributes: ["id", "email", "password"],
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

  async userExist(email: string): Promise<boolean> {
    try {
      const user = await UserModel.findOne({ where: { email } });
      if (user) {
        throw new Error("Email is already in use. :(");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
