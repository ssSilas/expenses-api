import { ExpenseModel } from "../db/models/expense.model";
import { ExpenseData } from "../interface/expense.interface";

export class ExpenseService {
  async getAll(userId: number): Promise<ExpenseModel[]> {
    return await ExpenseModel.findAll({ where: { userfk: userId } });
  }

  async getById(id: number, userId: number): Promise<ExpenseModel> {
    await this.expenseExistsAndBelongs(id, userId);
    return await ExpenseModel.findOne({ where: { id } });
  }

  async create(userId: number, data: ExpenseData): Promise<boolean> {
    try {
      await ExpenseModel.create({ userfk: userId, ...data });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number,
    userId: number,
    data: ExpenseData
  ): Promise<boolean> {
    try {
      await this.expenseExistsAndBelongs(id, userId);
      await ExpenseModel.update({ ...data }, { where: { id } });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number, userId: number): Promise<boolean> {
    try {
      await this.expenseExistsAndBelongs(id, userId);
      await ExpenseModel.destroy({ where: { id } });
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async expenseExistsAndBelongs(
    id: number,
    userId: number
  ): Promise<boolean> {
    try {
      const expense = await ExpenseModel.findOne({
        where: { id, userfk: userId },
      });
      if (!expense) {
        throw new Error(
          "Expense does not exist or does not belong to the user. :("
        );
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
}
