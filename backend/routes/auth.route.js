import express from "express";
import { registerUser, userLogin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

//register user route
authRouter.post('/register', registerUser)
//login user route
authRouter.post('/login', userLogin)



export default authRouter