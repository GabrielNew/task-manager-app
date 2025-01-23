import express from "express";
import connectDB from "./config/database.js";
import { User } from "./models/User.js";
import { Task } from "./models/Task.js";
const { DB_URL } = process.env;

connectDB(DB_URL);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
});

app.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => {
      res.status(201).send(task);
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    })
    .catch((error) => {
      res.status(400).send({ error: error.message });
    });
});

app.get("/users", (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
    });
});

app.listen(port, () => {
  console.log("The server is online on port: " + port);
});
