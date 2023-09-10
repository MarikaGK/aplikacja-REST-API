import express from "express";
import cors from "cors";
import contactRouter from "./routes/contact.router.js";
import userRouter from "./routes/user.router.js";
import { AVATAR_DIR } from "./utils/avatar/avatar.variables.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/contacts", contactRouter);
app.use("/users", userRouter);
app.use("/avatars", express.static(AVATAR_DIR));

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api/contacts",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

export default app;
