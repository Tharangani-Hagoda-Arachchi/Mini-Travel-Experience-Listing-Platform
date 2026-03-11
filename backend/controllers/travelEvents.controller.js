import mongoose from "mongoose";
import { TravelEvent } from "../models/travelEvents.model.js";
import { User } from "../models/user.model.js";

//create new travel event
export const addTravelEvent = async (req, res, next) => {
    try {
        const { title, location, description, price, createdBy } = req.body;

        //check required field
        if (!title || !location || !description || !createdBy) {
            return res.status(400).json({ message: "All field are required" });
        }

        // Check if image is uploaded
        if (!req.file) {
            return res.status(400).json({
                status: "Fail",
                message: "Image is required"
            });
        }

        // Path of the uploaded image
        const imagePath = `/item-images/${req.file.filename}`;

        // check if travel event already exist
        const existingEvent = await TravelEvent.findOne({ title });
        if (existingEvent) {
            return res.status(400).json({ message: "Travel event with this title already exists" });
        }

        // check if user is valid
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(400).json({ message: "Invalid user" });
        }

        const travelEvent = new TravelEvent({
            title,
            location,
            description,
            price,
            createdBy,
            images: [imagePath]
        });

        await travelEvent.save();

        res.status(201).json({
            status: "Success",
            message: "New Travel Event Added Successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// fetch all travel events
export const fetchTravelEvents = async (req, res, next) => {
    try {

        //fetch all travel events with user name and sort by created time
        const travelEvents = await TravelEvent
            .find()
            .populate("createdBy", "userFirstName userLastName") // get user name
            .sort({ createdAt: -1 }); // newest to oldest

        if (!travelEvents || travelEvents.length === 0) {
            return res.status(404).json({ message: "No travel events found" });
        }

        // format response
        const formattedEvents = travelEvents.map(exp => {

            const createdTime = new Date(exp.createdAt);
            const now = new Date();

            const diffMs = now - createdTime;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            let postedTime = "";

            if (diffMinutes < 60) {
                postedTime = `Posted ${diffMinutes} minute(s) ago`;
            } else if (diffHours < 24) {
                postedTime = `Posted ${diffHours} hour(s) ago`;
            } else {
                postedTime = `Posted ${diffDays} day(s) ago`;
            }

            return {
                _id: exp._id,
                title: exp.title,
                location: exp.location,
                description: exp.description,
                price: exp.price,
                images: exp.images,
                createdBy: `${exp.createdBy.userFirstName} ${exp.createdBy.userLastName}`,
                postedTime
            };
        });

        res.status(200).json({
            status: "Success",
            message: "Fetch All Travel Events Successfully",
            data: formattedEvents
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

//fetch travel events by  id
export const fetchTravelEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const exp = await TravelEvent
            .findById(id)
            .populate("createdBy", "userFirstName userLastName");

        if (!exp) {
            return res.status(404).json({ message: "Travel event not found" });
        }

        const createdTime = new Date(exp.createdAt);
        const now = new Date();

        const diffMs = now - createdTime;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let postedTime = "";

        if (diffMinutes < 60) postedTime = `Posted ${diffMinutes} minute(s) ago`;
        else if (diffHours < 24) postedTime = `Posted ${diffHours} hour(s) ago`;
        else postedTime = `Posted ${diffDays} day(s) ago`;

        const formattedEvent = {
            _id: exp._id,
            title: exp.title,
            location: exp.location,
            description: exp.description,
            price: exp.price,
            images: exp.images,
            createdBy: exp.createdBy
                ? `${exp.createdBy.userFirstName} ${exp.createdBy.userLastName}`
                : "Unknown User",
            postedTime
        };

        res.status(200).json({
            status: "Success",
            data: formattedEvent
        });

    } catch (error) {
        console.error("Fetch event by ID error:", error);

        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

//fetch travel event by created user id
export const getEventsByCreatedBy = async (req, res, next) => {
    try {
        const { createdBy } = req.params;
        // check required field
        if (!createdBy) {
            return res.status(400).json({ message: "Created person id is Required" });
        }

        // search for travel events belong to createdBy id
        const eventsByCreatedBy = await TravelEvent.find({ createdBy });

        if (eventsByCreatedBy.length === 0) {
            return res.status(404).json({ message: "No travel events found for the specified user" });
        }

        res.status(200).json({
            status: "Success",
            message: "Fetch Travel Events Successfully",
            data: eventsByCreatedBy
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//delete travel event by id
export const deleteTravelEvent = async (req, res, next) => {
    try {
        const { id } = req.params;

        // check required field
        if (!id) {
            return res.status(400).json({ message: "Travel event id is Required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid event ID"
            });
        }

        // search for travel event by id and delete
        const deletedEvent = await TravelEvent.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Travel event not found" });
        }

        res.status(200).json({
            status: "Success",
            message: "Travel Event Deleted Successfully"
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//update travel event by id
import fs from "fs";
import path from "path";

// Update travel event by ID
export const updateTravelEvent = async (req, res, next) => {
    try {
        const { _id } = req.params;
        const { title, location, description, price } = req.body;

        if (!_id) {
            return res.status(400).json({ message: "Travel event id is required" });
        }

        // Find the existing event
        const event = await TravelEvent.findById(_id);
        if (!event) {
            return res.status(404).json({ message: "Travel event not found" });
        }

        // Update fields
        event.title = title || event.title;
        event.location = location || event.location;
        event.description = description || event.description;
        event.price = price || event.price;

        // Handle image update if a new file is uploaded
        if (req.file) {
            // Delete old image if exists
            if (event.image) {
                fs.unlink(path.join(__dirname, "..", "uploads", event.image), (err) => {
                    if (err) console.log("Failed to delete old image:", err);
                });
            }
            event.image = req.file.filename; // assuming multer stores filename
        }

        // Save updated event
        const updatedEvent = await event.save();

        res.status(200).json({
            status: "Success",
            message: "Travel Event Updated Successfully",
            data: updatedEvent
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};