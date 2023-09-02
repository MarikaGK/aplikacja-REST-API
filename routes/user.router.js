import { Router } from "express";
import {
  create,
  getCurrent,
  login,
  logout,
  updateSubscriptionStatus,
} from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/signup", create);

userRouter.post("/login", login);

userRouter.get("/logout", logout);

userRouter.get("/current", getCurrent);

userRouter.patch("/", updateSubscriptionStatus);
