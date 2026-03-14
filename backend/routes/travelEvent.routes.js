import express from "express";
import multer from "multer";
import path from 'path';
import fs from 'fs';
import { addTravelEvent, deleteTravelEvent, fetchTravelEventById, fetchTravelEvents, getEventsByCreatedBy, updateTravelEvent } from "../controllers/travelEvents.controller.js";
import { authenticate, authorizeRoles } from "../midlewares/authentication.midleware.js";

const travelEventRouter = express.Router();

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

//create new travel event route
travelEventRouter.post('/events', authenticate, authorizeRoles("Experience Provider"), upload.single('image'), addTravelEvent);

// featch all travel events
travelEventRouter.get('/events', fetchTravelEvents);

// featch travel event by id
travelEventRouter.get('/events/details/:id', fetchTravelEventById);

// featch travel event by created user id
travelEventRouter.get('/events/:createdBy', authenticate, authorizeRoles("Experience Provider"), getEventsByCreatedBy);

//delete travel event by id
travelEventRouter.delete('/events/:id', authenticate, authorizeRoles("Experience Provider"), deleteTravelEvent);

//update travel event by id
travelEventRouter.put('/events/:id', authenticate, authorizeRoles("Experience Provider"), updateTravelEvent);




export default travelEventRouter