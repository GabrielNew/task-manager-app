import mongoose from "mongoose";
import { Task } from "../models/Task";

const { DB_URL } = process.env;

mongoose.connect(DB_URL);

const t = new Task({ description: "Test", completed: false });

t.save()
  .then(() => {
    console.log(task);
  })
  .catch((error) => {
    console.log(error);
  });
