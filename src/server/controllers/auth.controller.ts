import { Request, Response } from 'express';
import { getErrorMessage } from '../error/common.error';
import { AuthService } from '../service/auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService){}

  async login (req: Request, res: Response) {
   try {
     const foundUser = await this.authService.login(req.body);
     res.status(200).send(foundUser);
   } catch (error) {
     return res.status(500).send(getErrorMessage(error));
   }
  };
  
  async create (req: Request, res: Response) {
   try {
     await this.authService.create(req.body);
     res.status(200).send('Inserted successfully');
   } catch (error) {
     return res.status(500).send(getErrorMessage(error));
   }
  };
}
