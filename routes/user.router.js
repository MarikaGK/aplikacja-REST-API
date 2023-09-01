import { Router } from "express";
import { create, login, logout } from "../controller/user.controller";

const userRouter = Router();

userRouter.post("/signup", create);

userRouter.post("/login", login);

userRouter.get("/logout", logout);
