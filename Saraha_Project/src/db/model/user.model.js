import mongoose from "mongoose";
import * as enums from "../../common/enum/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "First name must be more than 3 charachters"],
      maxlength: [10, "First name must be less than 20 charachters"],
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      minlength: [3, "Last name must be more than 3 charachters"],
      maxlength: [10, "Last name must be less than 20 charachters"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: [6, "Password name must be more than 6 charachters"],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    DOB: Date,
    gender: {
      type: Number,
      enum: Object.values(enums.genderEnum),
    },
    image: String,
    deletedAt: Date,
    confirmEmail: {
      type: Date,
      default: new Date(),
    },
    provider: {
      type: Number,
      enum: Object.values(enums.providerEnum),
      default: enums.providerEnum.system,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("name")
  .set(function (fullName) {
    const [firstName, lastName] = fullName.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

export const userModel = mongoose.model("user", userSchema, "user");
