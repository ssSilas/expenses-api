import { AuthService } from "../../server/service/auth.service";
import {
  CreateUser,
  DataUserModel,
  LoginData,
} from "../../server/interface/auth.interface";
import { JwtService } from "../../server/service/jwt.service";
import { UserModel } from "../../server/db/models/user.model";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userResponse: DataUserModel;

  beforeEach(() => {
    userResponse = {
      id: 1,
      name: "teste",
      email: "test@test.com.br",
      password: "testeste",
    };

    jest.spyOn(UserModel, "create").mockResolvedValue(true);
    jest.spyOn(UserModel, "findOne").mockReturnThis();

    jwtService = {
      checkPassword: jest.fn(),
      generateToken: jest.fn().mockReturnValue({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJndWltYXJhZXNzaXNsYXMxNUBnbWFpbC5jb20iLCJpYXQiOjE3MDkwMzgzMDIsImV4cCI6MTcwOTQ3MDMwMn0.KTxrMmIZ93aCnJ_BGsgVIb5MwuIT-nM1xTVBJFxiklQ",
      }),
    };
    service = new AuthService(jwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve criar uma instância do SurveyService", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create user", async () => {
      const data: CreateUser = {
        name: userResponse.name,
        email: userResponse.email,
        password: userResponse.password,
      };

      UserModel.findOne = jest.fn().mockResolvedValue(false);
      const create = await service.create(data);
      const expectOutputReponse = create;

      expect(UserModel.create).toHaveBeenCalled();
      expect(UserModel.create).toHaveBeenCalledTimes(1);
      expect(expectOutputReponse).toStrictEqual(create);
    });

    it("should throw an error if exist", async () => {
      const data: CreateUser = {
        name: userResponse.name,
        email: userResponse.email,
        password: userResponse.password,
      };
      UserModel.findOne = jest.fn().mockResolvedValue(true);
      try {
        await service.create(data);
      } catch (error) {
        expect(error.message).toEqual("Email is already in use. :(");
      }
    });
  });

  describe("login", () => {
    it("must authenticate user and return token", async () => {
      const user: LoginData = {
        email: userResponse.email,
        password: userResponse.password,
      };
      const login = await service.login(user);
      const expectOutputReponse = login;

      expect(login.token).toBeDefined();
      expect(typeof login.token).toBe("object");
      expect(login).toEqual(expectOutputReponse);
    });

    it("should throw an error if user does not exist", async () => {
      const user: LoginData = {
        email: userResponse.email,
        password: userResponse.password,
      };

      UserModel.findOne = jest.fn().mockResolvedValue(false);
      try {
        await service.login(user);
      } catch (error) {
        expect(error.message).toEqual("User not exist.");
      }
    });
  });
});
