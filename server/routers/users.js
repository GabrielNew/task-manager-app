import express from "express";
import { User } from "../models/User.js";
import { Task } from "../models/Task.js";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import sharp from "sharp";

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file) {
      return cb(
        new Error("Please provide an image in jpg, jpeg or png format!")
      );
    }

    if (!file.originalname.match(/\.(png|jpg|jpeg)$/gm)) {
      return cb(new Error("please, upload jpg or png files"));
    }

    cb(undefined, true);
  },
});

const userRouter = new express.Router();

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (error) {
    res.status(400).send();
  }
});

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

userRouter.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const user = req.user;

    updates.forEach((update) => {
      user[update] = req.body[update];
    });

    await user.save();

    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await Task.deleteMany({ owner: req.user._id.toString() });
    await req.user.deleteOne();
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

userRouter.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

userRouter.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

export { userRouter };
