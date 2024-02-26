import { Router } from "express";
import { ExpenseService } from "../service/expense.service";
import { ExpenseController } from "../controllers/expense.controller";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import { MailService } from "../service/mail.service";

const authMiddleware = new AuthMiddleware();
const checkToken = authMiddleware.checkToken;

const expenseService = new ExpenseService();
const mailService = new MailService();
const ExpenseControllerInstance = new ExpenseController(
  expenseService,
  mailService
);

const expense_router = Router();

expense_router.get(
  "/",
  checkToken,
  ExpenseControllerInstance.getAll.bind(ExpenseControllerInstance)
);

expense_router.get(
  "/get-by-id",
  checkToken,
  ExpenseControllerInstance.getById.bind(ExpenseControllerInstance)
);

expense_router.post(
  "/",
  checkToken,
  ExpenseControllerInstance.create.bind(ExpenseControllerInstance)
);

expense_router.put(
  "/",
  checkToken,
  ExpenseControllerInstance.update.bind(ExpenseControllerInstance)
);

expense_router.delete(
  "/",
  checkToken,
  ExpenseControllerInstance.delete.bind(ExpenseControllerInstance)
);

export default expense_router;
