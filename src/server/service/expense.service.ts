import { ExpenseModel } from "../db/models/expense.model";

export class ExpenseService {
  async getAll(userId: number) {
    return await ExpenseModel.findAll({ where: { id: userId } });
  }

  async getById(id: number, userId: number) {
    await this.expenseExistsAndBelongs(id, userId);
    return await ExpenseModel.findOne({ where: { id } });
  }

  async create(userId: number, data: any): Promise<boolean> {
    try {
      await ExpenseModel.create({ userfk: userId, ...data });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, userId: number, data: any): Promise<boolean> {
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

  private async expenseExistsAndBelongs(id: number, userId: number) {
    try {
      const expense = await ExpenseModel.findOne({ where: { id } });
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
