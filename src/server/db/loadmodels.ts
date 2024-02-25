import { ExpenseModel } from "./models/expense.model";
import { UserModel } from "./models/user.model";

export const loadModels = () => {
  return [
    UserModel.hasMany(ExpenseModel, { foreignKey: "userfk" }),
    ExpenseModel.belongsTo(UserModel, { foreignKey: "userfk" }),
  ];
};
