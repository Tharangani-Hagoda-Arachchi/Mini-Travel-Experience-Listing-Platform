import express from "express";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { addTravelEvent } from "../controllers/travelEvents.controller.js";
import { authenticate, authorizeRoles } from "../midlewares/authentication.midleware.js";

const travelEventRouter = express.Router();

// Multer setup with automatic folder creation
const uploadFolder = path.join(process.cwd(), 'item-images');
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadFolder),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

//create new travel event route
travelEventRouter.post('/events', authenticate, authorizeRoles("Experience Provider"), upload.single('image'), addTravelEvent);




export default travelEventRouter