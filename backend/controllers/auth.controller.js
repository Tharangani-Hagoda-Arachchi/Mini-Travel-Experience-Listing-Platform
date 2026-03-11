import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const registerUser = async (req, res, next) => {
    try {
        const { userFirstName, userLastName, email, password, role } = req.body;

        //check availability of required fields
        if (!userFirstName || !userLastName || !email || !password || !role) {
            return res.status(400).json({ message: "All field are required" });
        }

        //check email is already registered
        const existingEmail = await User.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "email is already registered" });
        }

        //hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            userFirstName: userFirstName,
            userLastName: userLastName,
            email: email,
            password: hashedPassword,
            role: role
        });

        await user.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });

    }


}