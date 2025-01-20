import mongoose from "mongoose";
import validator from "validator";

const UserSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validade(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  age: {
    type: Number,
    validade(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
});

const User = new mongoose.model("user", UserSchema);

export { User };
