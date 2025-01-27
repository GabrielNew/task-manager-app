import express from "express";
import connectDB from "./config/database.js";
import { userRouter } from "./routers/users.js";
import { taskRouter } from "./routers/tasks.js";
const { DB_URL } = process.env;

connectDB(DB_URL);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("The server is online on port: " + port);
});
