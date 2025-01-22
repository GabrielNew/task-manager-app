import mongoose from "mongoose";
import validator from "validator";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validade(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    default: 18,
    validade(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 7,
    validade(value) {
      if (value.toLowerCase().contains("password")) {
        throw new Error("This password is too insecure");
      }
    },
  },
});

const User = new mongoose.model("user", UserSchema);

export { User };
