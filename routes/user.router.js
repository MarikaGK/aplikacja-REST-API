import { Router } from "express";
import {
  create,
  getCurrent,
  login,
  logout,
  updateSubscriptionStatus,
} from "../controller/user.controller.js";
import auth from "../auth/user.auth.js";

const userRouter = Router();

userRouter.post("/signup", create);

userRouter.post("/login", login);

userRouter.get("/logout", auth, logout);

userRouter.get("/current", auth, getCurrent);

userRouter.patch("/", auth, updateSubscriptionStatus);

export default userRouter
