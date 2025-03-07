import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
const { AUTH_KEY } = process.env;

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, AUTH_KEY);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

export { auth };
