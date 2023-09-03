import { Router } from "express";
import {
  create,
  getCurrent,
  login,
  logout,
  updateSubscriptionStatus,
} from "../controller/user.controller";
import auth from "../auth/user.auth";

const userRouter = Router();

userRouter.post("/signup", create);

userRouter.post("/login", login);

userRouter.get("/logout", auth, logout);

userRouter.get("/current", auth, getCurrent);

userRouter.patch("/", auth, updateSubscriptionStatus);
