import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../service/auth.service";

const authService = new AuthService();
const instanceAuthClass = new AuthController(authService);

const auth_router = Router();
auth_router.post("/login", instanceAuthClass.login);
auth_router.post("/register", instanceAuthClass.create);

export default auth_router;
