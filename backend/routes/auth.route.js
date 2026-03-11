import express from "express";
import { logout, registerUser, userLogin } from "../controllers/auth.controller.js";

const authRouter = express.Router();

//register user route
authRouter.post('/register', registerUser)
//login user route
authRouter.post('/login', userLogin)
//logout user route
authRouter.post('/logout', logout)



export default authRouter