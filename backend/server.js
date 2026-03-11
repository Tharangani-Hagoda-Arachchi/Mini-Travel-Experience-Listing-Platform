import express from 'express';
import cors from 'cors';
import path from "path";
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import travelEventRouter from './routes/travelEvent.routes.js';


const app = express();

app.use(express.json());
// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173", // dev frontend
  "https://mini-travel-experience-listing-plat-wheat.vercel.app" // prod frontend
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/curl
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("CORS not allowed"), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Handle preflight OPTIONS requests globally
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(cookieParser());

app.use(
  "/item-images",
  express.static(path.join(process.cwd(), "item-images"))
);

//routes decleration
app.use("/api/v1/auths", authRouter)
app.use("/api/v1/", travelEventRouter)

export default app;