import {
  BeforeSave,
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { createHash } from "crypto";
import { ExpenseModel } from "./expense.model";
import { configEnv } from "../../../config/env.config";

@Table({
  tableName: "user",
  freezeTableName: true,
  timestamps: true,
})
export class UserModel extends Model {
  @PrimaryKey
  @Column({
    allowNull: false,
    autoIncrement: true,
    type: DataType.INTEGER,
  })
  userId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  email: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  password: string;

  @HasMany(() => ExpenseModel)
  expenses: ExpenseModel[];

  // Adicione um hook antes de salvar
  @BeforeSave
  static async hashPassword(instance: UserModel) {
    if (!instance.dataValues.userId || instance.changed("password")) {
      const salt = configEnv.salt;
      const password = instance.getDataValue("password");
      const passSalt = password + salt;
      const encrypted = createHash("sha1").update(passSalt).digest("hex");
      instance.dataValues.password = encrypted;
    }
  }
}
