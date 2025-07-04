import { Router } from "express";
import { signup, signin, getUser } from "../controller/user.controller.js";

const userRouter = Router();

// GET all users
userRouter.get("/", getUser);

// POST /signup -> register new user
userRouter.post("/signup", signup);

// POST /signin -> login user
userRouter.post("/signin", signin);

export default userRouter;
