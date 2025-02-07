import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    completed: { type: Boolean, required: false, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const Task = new mongoose.model("task", TaskSchema);

export { Task };
