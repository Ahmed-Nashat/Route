import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const commentModel = sequelize.define(
  "comment",
  {
    content: {
      type: DataTypes.TEXT,
      validate: {
        len: [5, 1000],
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);
