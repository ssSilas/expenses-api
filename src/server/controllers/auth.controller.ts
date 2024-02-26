import { Request, Response } from "express";
import { getErrorMessage } from "../error/common.error";
import { AuthService } from "../service/auth.service";
import { CreateUser, LoginData } from "../interface/auth.interface";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { email, password } = req.body;
      const data: LoginData = { email, password };

      const foundUser = await this.authService.login(data);
      res.status(200).send(foundUser);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async create(
    req: Request,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { name, email, password } = req.body;
      const data: CreateUser = { name, email, password };

      await this.authService.create(data);
      res.status(201).send(true);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }
}
