import dotenv from "dotenv";
import app from "./server.js";
import { DBConnect } from "./config/dbConnection.js";

dotenv.config({
    path: './.env'
})

const port = process.env.PORT 

//start server
const serverStart = async () => {
    try {

        await DBConnect();

        app.on("error", (error) => {
            console.log("Error", error);
            throw error;
        })

        app.listen(port, () => {
            console.log(`App listen on port No ${port}`);
            console.log(`App running URL: http://localhost:${port}`)
        })

    } catch (error) {
        console.log("MongoDB connection Error", error)

    }

}

serverStart();