import { Router } from "express";
import UserController from "../controllers/user";

const userRouter = Router();

userRouter.post("/register", UserController.addUser);
