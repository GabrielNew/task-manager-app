import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const { AUTH_KEY } = process.env;

const UserSchema = mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  //console.log(AUTH_KEY);
  const token = jwt.sign({ _id: user._id.toString() }, "test");

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash password before save in the database
UserSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = new mongoose.model("user", UserSchema);

export { User };
