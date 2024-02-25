import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { UserModel } from "./user.model";

@Table({
  tableName: "expense",
  freezeTableName: true,
  timestamps: true,
})
export class ExpenseModel extends Model {
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  description: string;

  @Column({
    allowNull: false,
    type: DataType.DATEONLY,
  })
  date: string;

  @Column({
    allowNull: false,
    type: DataType.DECIMAL(10, 2),
  })
  price: number;

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userfk: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
