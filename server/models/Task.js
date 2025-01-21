import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true, trim: true },
  completed: { type: Boolean, required: false, default: false },
});

const Task = new mongoose.model("task", TaskSchema);

export { Task };
