import { DataTypes } from "sequelize";
import { sequelize } from "../connection.js";

export const userModel = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        isAlpha: {
          msg: "Only alphapets are allowed",
        },
        len: [2, 30],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      validate: {
        checkNameLength(value) {
          if (!value || value.length < 6 || value.length > 42) {
            throw new Error(
              "The password length should be between 6 and 42 characters.",
            );
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["user", "admin"],
      validate: {
        checkRole(value) {
          if (value !== "user" && value !== "admin") {
            throw new Error("Only 'user' or 'admin' is allowed", {
              cause: 401,
            });
          }
        },
      },
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
);

// await userModel.sync({ alter: true });
