import express from "express";
import { registerUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

//register user route
authRouter.post('/register',registerUser)



export default authRouter