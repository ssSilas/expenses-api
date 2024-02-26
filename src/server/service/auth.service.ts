import { UserModel } from "../db/models/user.model";
import { CreateUser, LoginData } from "../interface/auth.interface";
import { JwtService } from "./jwt.service";

export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async create(user: CreateUser): Promise<boolean> {
    try {
      await this.userExist(user.email);
      await UserModel.create({ ...user });

      return true;
    } catch (error) {
      throw error;
    }
  }

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

  private async findUserByEmail(email: string): Promise<UserModel> {
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

  private async userExist(email: string): Promise<boolean> {
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
}
