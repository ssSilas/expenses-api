import { Response } from "express";
import { ExpenseController } from "../../server/controllers/expense.controller";
import { ExpenseService } from "../../server/service/expense.service";
import { MailService } from "../../server/service/mail.service";
import { DataUserModel } from "../../server/interface/auth.interface";
import {
  DataExpenseModel,
  ExpenseData,
} from "../../server/interface/expense.interface";
import { checkAndParseId } from "../../server/utils/util";

jest.mock("../../server/utils/util", () => ({
  checkAndParseId: jest.fn().mockReturnValue(1),
}));

describe("ExpenseController", () => {
  let controller: ExpenseController;
  let expenseService: ExpenseService;
  let mailService: MailService;
  let mockResponse: Response;
  let user: DataUserModel;
  let expenseData: DataExpenseModel;
  let body: ExpenseData;
  let mailStructure: { subject: string; message: string };

  beforeEach(() => {
    user = {
      id: 1,
      name: "teste",
      email: "test@test.com.br",
      password: "testeste",
    };
    expenseData = {
      description: "Nova despesa",
      date: "2020-02-03",
      price: 20.5,
      userfk: user.id,
    };

    mailStructure = {
      subject: "Expense Created",
      message: "Expense 1 created successfully.",
    };

    body = {
      description: expenseData.description,
      date: expenseData.date,
      price: expenseData.price,
    };

    expenseService = new ExpenseService();
    mailService = new MailService();
    controller = new ExpenseController(expenseService, mailService);
    mockResponse = {} as Response;
    mockResponse.status = jest.fn().mockReturnValue(mockResponse);
    mockResponse.send = jest.fn().mockReturnValue(mockResponse);

    jest.spyOn(controller, "validateBodyData").mockReturnValue(true);
    jest.spyOn(mailService, "mailStructure").mockReturnValue(mailStructure);

    jest.spyOn(mailService, "sendMail").mockReturnThis();
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return status 200 and expenses", async () => {
      const req = { token: { id: 1 } };
      const expenses = [expenseData];
      expenseService.getAll = jest.fn().mockResolvedValue(expenses);

      await controller.getAll(req as any, mockResponse);

      expect(expenseService.getAll).toHaveBeenCalledWith(req.token.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(expenses);
    });

    it("should return status 500 if an error occurs", async () => {
      const req = { token: { id: 1 } };
      const errorMessage = "Internal Server Error";
      expenseService.getAll = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await controller.getAll(req as any, mockResponse);

      expect(expenseService.getAll).toHaveBeenCalledWith(req.token.id);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe("getById", () => {
    it("should return status 200 and the expense", async () => {
      const req = { token: { id: 1 }, query: { id: 1 } };
      const expense = expenseData;
      expenseService.getById = jest.fn().mockResolvedValue(expense);

      await controller.getById(req as any, mockResponse);

      expect(expenseService.getById).toHaveBeenCalledWith(1, req.token.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(expense);
    });

    it("should return status 500 if an error occurs", async () => {
      const req = { token: { id: 1 }, query: { id: 1 } };
      const errorMessage = "Internal Server Error";
      expenseService.getById = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await controller.getById(req as any, mockResponse);

      expect(expenseService.getById).toHaveBeenCalledWith(1, req.token.id);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe("create", () => {
    it("should return status 201 and true", async () => {
      const data: ExpenseData = {
        description: expenseData.description,
        date: expenseData.date,
        price: expenseData.price,
      };
      const req = {
        token: { id: user.id, email: user.email },
        body,
      };

      const postReturnValue = true;

      expenseService.create = jest.fn().mockResolvedValueOnce(postReturnValue);

      await controller.create(req as any, mockResponse);

      expect(controller.validateBodyData).toHaveBeenCalledWith(data);
      expect(expenseService.create).toHaveBeenCalledWith(
        req.token.id,
        req.body
      );
      expect(mailService.mailStructure).toHaveBeenCalledWith(data);
      expect(mailService.sendMail).toHaveBeenCalledWith(
        req.token.email,
        mailStructure.subject,
        mailStructure.message
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(postReturnValue);
    });

    it("should return status 500 if an error occurs", async () => {
      const req = {
        token: { id: user.id, email: user.email },
        body,
      };
      const errorMessage = "Internal Server Error";
      expenseService.create = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await controller.create(req as any, mockResponse);

      expect(expenseService.create).toHaveBeenCalledWith(
        req.token.id,
        req.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe("update", () => {
    it("should return status 200 and true", async () => {
      const req = {
        token: { id: user.id, email: user.email },
        query: { id: 1 },
        body,
      };
      expenseService.update = jest.fn().mockResolvedValue(true);

      await controller.update(req as any, mockResponse);

      expect(expenseService.update).toHaveBeenCalledWith(
        1,
        req.token.id,
        req.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(true);
    });

    it("should return status 500 if an error occurs", async () => {
      const req = {
        token: { id: user.id, email: user.email },
        query: { id: 1 },
        body,
      };

      const errorMessage = "Internal Server Error";
      expenseService.update = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await controller.update(req as any, mockResponse);

      expect(expenseService.update).toHaveBeenCalledWith(
        1,
        req.token.id,
        req.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe("delete", () => {
    it("should return status 200 and true", async () => {
      const req = { token: { id: 1 }, query: { id: 1 } };
      expenseService.delete = jest.fn().mockResolvedValue(true);

      await controller.delete(req as any, mockResponse);

      expect(expenseService.delete).toHaveBeenCalledWith(1, req.token.id);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.send).toHaveBeenCalledWith(true);
    });

    it("should return status 500 if an error occurs", async () => {
      const req = { token: { id: 1 }, query: { id: 1 } };
      const errorMessage = "Internal Server Error";
      expenseService.delete = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      await controller.delete(req as any, mockResponse);

      expect(expenseService.delete).toHaveBeenCalledWith(1, req.token.id);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe("validateBodyData", () => {
    it("should throw error if date is empty", () => {
      const invalidData: ExpenseData = {
        description: "Nova despesa",
        date: "",
        price: 20.5,
      };

      try {
        controller.validateBodyData(invalidData);
      } catch (error) {
        expect(error.message).toEqual("Values cannot be empty.");
      }
    });

    it("should throw error if description is empty", () => {
      const invalidData: ExpenseData = {
        description: "",
        date: "2022-02-28",
        price: 20.5,
      };

      try {
        controller.validateBodyData(invalidData);
      } catch (error) {
        expect(error.message).toEqual("Values cannot be empty.");
      }
    });

    it("should throw error if price is empty", () => {
      const invalidData: ExpenseData = {
        description: "Nova despesa",
        date: "2022-02-28",
        price: null,
      };

      try {
        controller.validateBodyData(invalidData);
      } catch (error) {
        expect(error.message).toEqual("Values cannot be empty.");
      }
    });

    it("should throw error if date is in the future", () => {
      const invalidData: ExpenseData = {
        description: "Nova despesa",
        date: "2024-02-28",
        price: 20.5,
      };

      try {
        controller.validateBodyData(invalidData);
      } catch (error) {
        expect(error.message).toEqual("The date cannot be in the future.");
      }
    });

    it("should throw error if price is negative", () => {
      const invalidData: ExpenseData = {
        description: "Nova despesa",
        date: "2022-02-28",
        price: -20.5,
      };

      try {
        controller.validateBodyData(invalidData);
      } catch (error) {
        expect(error.message).toEqual("The price cannot be negative.");
      }
    });

    it("should throw error if description length is greater than 191 characters", () => {
      const invalidData: ExpenseData = {
        description: "a".repeat(192),
        date: "2022-02-28",
        price: 20.5,
      };

      try {
        controller.validateBodyData(invalidData);
      } catch (error) {
        expect(error.message).toEqual(
          "The description cannot be less than 191 characters."
        );
      }
    });
  });
});
