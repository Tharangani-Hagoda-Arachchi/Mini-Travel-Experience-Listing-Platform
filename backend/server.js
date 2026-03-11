import express from 'express';
import cors from 'cors';
import path from "path";
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import travelEventRouter from './routes/travelEvent.routes.js';


const app = express();

app.use(express.json());
app.use(cors({
  origin: "https://mini-travel-experience-listing-plat-wheat.vercel.app", //  frontend URL
  credentials: true,               // allow cookies to be sent
}));
app.use(cookieParser());

app.use(
  "/item-images",
  express.static(path.join(process.cwd(), "item-images"))
);

//routes decleration
app.use("/api/v1/auths",authRouter )
app.use("/api/v1/",travelEventRouter )

export default app;