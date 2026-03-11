import mongoose from "mongoose";

const userschema = new mongoose.Schema({

    userFirstName: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 30,
        trim: true

    },

    userLastName: {
        type: String,
        require: true,
        minLength: 3,
        maxLength: 30,
        trim: true

    },

    email: {
        type: String,
        require: true,
        unique: true,
        trim: true

    },

    password: {
        type: String,
        require: true,
        minLength: 6
    },

    role: {
        type: String,
        enum: ["Experience Provider", "Traveler"],
        default: "Traveler"
    },

    refreshToken: {
        type: [String],
        default: []
    }

},
    {
        timestamps: true
    }

)

export const User = mongoose.model("User", userschema)