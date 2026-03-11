import mongoose from "mongoose";

const travelEventSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 100,

    },

    location: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 50,
    },

    description: {
        type: String,
        require: true,
    },

    price: {
        type: Number,
    },

    postedTime: {
        type: Date,
        default: Date.now
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,

    },

    images: [{
        type: String,
        require: true
    }],
},
    {
        timestamps: true
    }

)

export const TravelEvent = mongoose.model("TravelEvent", travelEventSchema) 