import { Response } from "express";
import { getErrorMessage } from "../error/common.error";
import { ExpenseService } from "../service/expense.service";
import { CustomRequest } from "src/middleware/auth.middleware";
import { checkAndParseId } from "../utils/util";

export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  async getAll(req: CustomRequest, res: Response) {
    try {
      const get = await this.expenseService.getAll(req.token.id);
      res.status(200).send(get);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async getById(req: CustomRequest, res: Response) {
    try {
      const id = req.body.id;
      const get = await this.expenseService.getById(id, req.token.id);
      res.status(200).send(get);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async create(req: CustomRequest, res: Response) {
    try {
      const post = await this.expenseService.create(req.token.id, req.body);
      res.status(200).send(post);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async update(req: CustomRequest, res: Response) {
    try {
      const id = checkAndParseId(req.query.id);
      const put = await this.expenseService.update(id, req.token.id, req.body);
      res.status(200).send(put);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async delete(req: CustomRequest, res: Response) {
    try {
      const id = checkAndParseId(req.query.id);
      const del = await this.expenseService.delete(id, req.token.id);
      res.status(200).send(del);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }
}
