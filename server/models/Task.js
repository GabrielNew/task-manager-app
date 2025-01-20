import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  completed: { type: Boolean, required: true },
});

const Task = new mongoose.model("task", TaskSchema);

export { Task };
