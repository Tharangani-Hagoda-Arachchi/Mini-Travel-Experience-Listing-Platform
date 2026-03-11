import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import travelEventRouter from "./routes/travelEvent.routes.js";

const app = express();

// allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mini-travel-experience-listing-plat-pearl.vercel.app"
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / server requests

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// static folder for images
app.use(
  "/item-images",
  express.static(path.join(process.cwd(), "item-images"))
);

// routes
app.use("/api/v1/auths", authRouter);
app.use("/api/v1", travelEventRouter);

export default app;