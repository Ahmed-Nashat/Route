import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const postModel = sequelize.define(
  "post",
  {
    title: {
      type: DataTypes.STRING(255),
      validate: {
        len: [5, 50],
      },
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        len: [5, 1000],
      },
    },
  },
  {
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
  },
);
