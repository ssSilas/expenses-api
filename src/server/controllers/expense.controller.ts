import { Response } from "express";
import { getErrorMessage } from "../error/common.error";
import { ExpenseService } from "../service/expense.service";
import { CustomRequest } from "src/middleware/auth.middleware";
import { checkAndParseId, isFutureDate } from "../utils/util";
import { ExpenseData } from "../interface/expense.interface";

export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  async getAll(
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const get = await this.expenseService.getAll(req.token.id);
      res.status(200).send(get);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async getById(
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.body.id;
      const get = await this.expenseService.getById(id, req.token.id);
      res.status(200).send(get);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async create(
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const { description, date, price } = req.body;
      const data: ExpenseData = {
        description,
        date,
        price,
      };

      //validating data before inserting or updating
      this.validateBodyData(data);

      const post = await this.expenseService.create(req.token.id, data);
      res.status(200).send(post);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async update(
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const id = checkAndParseId(req.query.id);
      const { description, date, price } = req.body;
      const data: ExpenseData = {
        description,
        date,
        price,
      };

      //validating data before inserting or updating
      this.validateBodyData(data);

      const put = await this.expenseService.update(id, req.token.id, data);
      res.status(200).send(put);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  async delete(
    req: CustomRequest,
    res: Response
  ): Promise<Response<any, Record<string, any>>> {
    try {
      const id = checkAndParseId(req.query.id);
      const del = await this.expenseService.delete(id, req.token.id);
      res.status(200).send(del);
    } catch (error) {
      console.log(error);
      return res.status(500).send(getErrorMessage(error));
    }
  }

  validateBodyData(values: ExpenseData): boolean {
    try {
      const date = values.date;
      const description = values.description;
      const price = values.price;

      //check is empty
      if (date.length || description.length || !price) {
        throw new Error("Os valores não podem estar vazios.");
      }

      //check if it is the future date
      const futureDate = new Date(date);
      if (isFutureDate(futureDate)) {
        throw new Error("The date cannot be in the future.");
      }

      //check negative price
      if (price < 0) {
        throw new Error("The price cannot be negative.");
      }

      //check number of characters
      const numberCharacters = 191;
      if (description.length > numberCharacters) {
        throw new Error("The description cannot be less than 191 characters.");
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
