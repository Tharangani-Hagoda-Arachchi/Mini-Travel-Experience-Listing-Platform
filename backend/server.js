import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routes decleration
app.use("/api/v1/auths",authRouter )

export default app;