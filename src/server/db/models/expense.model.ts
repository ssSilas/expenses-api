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
  tableName: "expenses",
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
    type: DataType.DECIMAL,
  })
  price: number;

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;
}
