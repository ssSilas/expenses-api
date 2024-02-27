import { UserModel } from "../../server/db/models/user.model";
import { AuthController } from "../../server/controllers/auth.controller";
import { DataUserModel } from "../../server/interface/auth.interface";
import { AuthService } from "../../server/service/auth.service";
import { JwtService } from "../../server/service/jwt.service";

// Função de mock para criar um objeto Response
const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("AuthController", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let controller: AuthController;
  let userResponse: DataUserModel;
  let token: string;

  beforeEach(() => {
    userResponse = {
      id: 1,
      name: "teste",
      email: "test@test.com.br",
      password: "testeste",
    };
    token = "string";

    jwtService = {
      checkPassword: jest.fn(),
      generateToken: jest.fn().mockReturnValue({ token }),
    };

    service = new AuthService(jwtService);
    controller = new AuthController(service);

    jest.spyOn(service, "create").mockResolvedValue(true);
    jest.spyOn(service, "login").mockResolvedValue({ token });
    jest.spyOn(service, "findUserByEmail").mockResolvedValue(userResponse);
    jest.spyOn(service, "userExist").mockResolvedValue(true);
  });

  describe("login", () => {
    it("should return status 200 and the user found", async () => {
      const body = {
        email: userResponse.email,
        password: userResponse.password,
      };

      const req = { body };
      const res = createMockResponse();

      await controller.login(req as any, res as any);

      expect(service.login).toHaveBeenCalledWith({
        email: userResponse.email,
        password: userResponse.password,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ token });
    });

    it("should return status 500 in case of error", async () => {
      const errorMessage = "User not exist.";
      service.login = jest.fn().mockRejectedValue(new Error(errorMessage));

      const body = {
        email: userResponse.email,
        password: userResponse.password,
      };

      const req = { body };
      const res = createMockResponse();

      await controller.login(req as any, res as any);

      expect(service.login).toHaveBeenCalledWith({
        email: userResponse.email,
        password: userResponse.password,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });

  describe("create", () => {
    it("should return status 201 and the user found", async () => {
      const body = {
        name: userResponse.name,
        email: userResponse.email,
        password: userResponse.password,
      };

      const req = { body };
      const res = createMockResponse();

      await controller.create(req as any, res as any);

      expect(service.create).toHaveBeenCalledWith({
        ...body,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(true);
    });

    it("should return status 500 in case of error", async () => {
      const errorMessage = "Email is already in use. :(";
      service.create = jest.fn().mockRejectedValue(new Error(errorMessage));

      const body = {
        email: userResponse.email,
        password: userResponse.password,
      };

      const req = { body };
      const res = createMockResponse();

      await controller.create(req as any, res as any);

      expect(service.create).toHaveBeenCalledWith({
        email: userResponse.email,
        password: userResponse.password,
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: `Error: ${errorMessage}`,
      });
    });
  });
});
