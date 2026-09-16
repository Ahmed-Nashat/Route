import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [3, "Name is too short"],
      maxlength: [10, "Name is too long"],
      trim: true,
      validate: {
        validator: function (value) {
          return value.toLowerCase() !== "admin";
        },
        message: (arg) => `${arg.path} value ${arg.value} is invalid`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    DOB: {
      type: Date,
      required: true,
      validate: {
        validator: function () {
          return this.age >= 18 && this.age <= 60;
        },
        message: "User age must be between 18 and 60 years.",
      },
    },
  },
  {
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    optimisticConcurrency: true,
  },
);

userSchema.virtual("age").get(function () {
  if (!this.DOB) return null;
  const today = new Date();
  let age = today.getFullYear() - this.DOB.getFullYear();
  const monthDiff = today.getMonth() - this.DOB.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < this.DOB.getDate())
  ) {
    age--;
  }
  return age;
});

userSchema.virtual("notes", {
  ref: "notes",
  localField: "_id",
  foreignField: "userId",
});
export const userModel = mongoose.model("users", userSchema);
