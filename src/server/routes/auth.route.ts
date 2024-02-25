import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../service/auth.service";
import { JwtService } from "../service/jwt.service";

const jwtService = new JwtService();
const authService = new AuthService(jwtService);
const AuthControllerInstance = new AuthController(authService);

const auth_router = Router();
auth_router.post(
  "/login",
  AuthControllerInstance.login.bind(AuthControllerInstance)
);
auth_router.post(
  "/register",
  AuthControllerInstance.create.bind(AuthControllerInstance)
);

export default auth_router;
