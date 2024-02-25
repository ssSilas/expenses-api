import { Sequelize } from "sequelize-typescript";
import { UserModel } from "./models/user.model";
import { ExpenseModel } from "./models/expense.model";
import { configEnv } from "../../config/env.config";

const isDev = configEnv.nodeEnv == "";
const dbInitAndSync = async () => {
  const sequelize = new Sequelize({
    dialect: "mysql",
    host: configEnv.hostDb,
    port: configEnv.portDb,
    username: configEnv.userDb,
    password: configEnv.passDb,
    database: configEnv.nameDb,
  });
  sequelize.addModels([UserModel, ExpenseModel]);
  await sequelize.sync({ alter: isDev });
};

export default dbInitAndSync;
