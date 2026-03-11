import { TravelEvent } from "../models/travelEvents.model";
import { User } from "../models/user.model";

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
