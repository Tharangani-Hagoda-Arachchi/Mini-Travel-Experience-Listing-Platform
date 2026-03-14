import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import travelEventRouter from "./routes/travelEvent.routes.js";

const app = express();

import cors from "cors";

app.use(cors({
  origin: "https://mini-travel-experience-listing-plat-pearl.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(
  "/item-images",
  express.static(path.join(process.cwd(), "item-images"))
);

app.use("/api/v1/auths", authRouter);
app.use("/api/v1", travelEventRouter);

export default app;