import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import { createAccessToken, createRefreshToken, verifyTokens } from "../utils/token.utils.js";

const cookieOptions = {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
};

//user registration logic
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

//user login logic
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //check all field are fill
        if (!email || !password) {
            return res.status(400).json({ message: "email and passwod are required" });
        }

        //check email is registered
        const existingEmail = await User.findOne({ email: email })
        if (!existingEmail) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //match password
        const matchedPassword = await bcrypt.compare(password, existingEmail.password);
        if (!matchedPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //crreate tokens
        const payload = { id: existingEmail._id, userFirstName: existingEmail.userFirstName, userLastName: existingEmail.userLastName, role: existingEmail.role }
        const accessToken = createAccessToken(payload, process.env.ACCESS_SCRET, process.env.ACCESS_EXPIREIN || '15m')
        const RefreshToken = createRefreshToken(payload, process.env.REFRESH_SCRET, process.env.REFRESH_EXPIREIN || '7d')

        //save refresh token
        existingEmail.refreshToken.push(RefreshToken)
        await existingEmail.save()

        // send refresh token as htttpOnly cookie
        res.cookie('refreshToken', RefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

        res.status(200).json({ message: "Login successfully", accessToken, })

    } catch (error) {
        res.status(500).json({ message: "internal server Error", error: error.message })
    }
}

//user logout logic
export const logout = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken || req.query?.refreshToken;

        //check token availability
        if (!token || typeof token !== "string") {
            return res.status(400).json({
                message: "No refresh token provided",
            })
        }

        // decode token 
        let decoded;
        try {
            decoded = verifyTokens(token, process.env.REFRESH_SCRET);
        } catch (err) {
            decoded = null;
        }

        // remove token from DB accoding user
        if (decoded) {
            const user = await User.findById(decoded.id);
            if (user) {
                user.refreshToken = user.refreshToken.filter((rt) => rt !== token);
                await user.save();
            }
        }

        // clear cookie
        res.clearCookie("refreshToken", cookieOptions);

        // response
        return res.status(200).json({
            status: "Success",
            message: "Logout successfully",
        });

    } catch (error) {
        res.status(500).json({ message: "internal server Error", error: error.message })
    }
};