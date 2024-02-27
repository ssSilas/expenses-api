import { ExpenseModel } from "../../server/db/models/expense.model";
import { DataUserModel } from "../../server/interface/auth.interface";
import { DataExpenseModel } from "../../server/interface/expense.interface";
import { ExpenseService } from "../../server/service/expense.service";

describe("ExpenseService", () => {
  let service: ExpenseService;
  let expenseId: number;
  let user: DataUserModel;
  let expenseDataResponse: DataExpenseModel;

  beforeEach(() => {
    expenseId = 1;
    user = {
      id: 1,
      name: "teste",
      email: "test@test.com.br",
      password: "testeste",
    };
    expenseDataResponse = {
      description: "Nova despesa",
      date: "2020-02-03",
      price: 20.5,
      userfk: user.id,
    };

    jest.spyOn(ExpenseModel, "create").mockResolvedValue(true);
    jest.spyOn(ExpenseModel, "update").mockResolvedValue([1]);
    jest.spyOn(ExpenseModel, "destroy").mockResolvedValue(1);
    jest.spyOn(ExpenseModel, "findOne").mockReturnThis();
    (ExpenseModel.findAll = jest.fn().mockResolvedValue([expenseDataResponse])),
      (service = new ExpenseService()); // Instancie o serviço aqui
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma instância do SurveyService", () => {
    expect(service).toBeDefined();
  });

  describe("getAll", () => {
    it("should return expenses for a given userId", async () => {
      const getAll = await service.getAll(user.id);
      const expectOutputReponse = getAll;

      expect(ExpenseModel.findAll).toHaveBeenCalled();
      expect(ExpenseModel.findAll).toHaveBeenCalledTimes(1);
      expect(ExpenseModel.findAll).toHaveBeenCalledWith({
        where: { userfk: expenseId },
      });
      expect(expectOutputReponse).toStrictEqual(getAll);
    });
  });

  describe("getById", () => {
    it("should return expense by id for a given userId", async () => {
      const userId = user.id;
      const id = expenseId;
      const getById = await service.getById(id, userId);
      const expectOutputReponse = getById;

      expect(ExpenseModel.findOne).toHaveBeenCalled();
      expect(ExpenseModel.findOne).toHaveBeenCalledTimes(2);
      expect(ExpenseModel.findOne).toHaveBeenCalledWith({
        where: { id: id },
      });
      expect(expectOutputReponse).toStrictEqual(getById);
    });

    it("should throw an error if expense does not exist or does not belong to the user", async () => {
      const userId = user.id;
      const id = expenseId;

      ExpenseModel.findOne = jest.fn().mockResolvedValue(false);
      try {
        await service.getById(id, userId);
      } catch (error) {
        expect(error.message).toEqual(
          "Expense does not exist or does not belong to the user. :("
        );
      }
    });
  });

  describe("create", () => {
    it("must create expenses for a given userId", async () => {
      const data = {
        description: expenseDataResponse.description,
        date: expenseDataResponse.date,
        price: expenseDataResponse.price,
      };

      const create = await service.create(user.id, data);
      const expectOutputReponse = create;

      expect(ExpenseModel.create).toHaveBeenCalled();
      expect(ExpenseModel.create).toHaveBeenCalledTimes(1);
      expect(ExpenseModel.create).toHaveBeenCalledWith({
        ...expenseDataResponse,
      });
      expect(expectOutputReponse).toStrictEqual(create);
    });
  });

  describe("update", () => {
    it("should update expense by id for a given userId", async () => {
      const userId = user.id;
      const id = expenseId;
      const data = {
        description: expenseDataResponse.description,
        date: expenseDataResponse.date,
        price: expenseDataResponse.price,
      };
      const update = await service.update(id, userId, data);
      const expectOutputReponse = update;

      expect(ExpenseModel.update).toHaveBeenCalled();
      expect(ExpenseModel.update).toHaveBeenCalledTimes(1);
      expect(ExpenseModel.update).toHaveBeenCalledWith(
        { ...data },
        { where: { id } }
      );
      expect(expectOutputReponse).toStrictEqual(update);
    });

    it("should throw an error if expense does not exist or does not belong to the user", async () => {
      const userId = user.id;
      const id = expenseId;

      ExpenseModel.findOne = jest.fn().mockResolvedValue(false);
      try {
        await service.getById(id, userId);
      } catch (error) {
        expect(error.message).toEqual(
          "Expense does not exist or does not belong to the user. :("
        );
      }
    });
  });

  describe("delete", () => {
    it("must delete expense by ID for a given userId", async () => {
      const id = expenseId;
      const userId = user.id;
      const deleteFn = await service.delete(id, userId);
      const expectOutputReponse = deleteFn;

      expect(ExpenseModel.destroy).toHaveBeenCalled();
      expect(ExpenseModel.destroy).toHaveBeenCalledTimes(1);
      expect(ExpenseModel.destroy).toHaveBeenCalledWith({
        where: { id },
      });
      expect(expectOutputReponse).toStrictEqual(deleteFn);
    });

    it("should throw an error if expense does not exist or does not belong to the user", async () => {
      const userId = user.id;
      const id = expenseId;

      ExpenseModel.findOne = jest.fn().mockResolvedValue(false);
      try {
        await service.getById(id, userId);
      } catch (error) {
        expect(error.message).toEqual(
          "Expense does not exist or does not belong to the user. :("
        );
      }
    });
  });

  // Test cases for other methods (create, update, delete) can be similarly written
});
