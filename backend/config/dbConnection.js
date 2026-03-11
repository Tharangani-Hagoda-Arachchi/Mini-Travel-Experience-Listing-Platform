import mongoose from "mongoose"; 

 export const DBConnect = async() =>{
    try {
        const conectionInstant = await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log("DB CONNECTED");

    } catch (error) {
        console.log("DB connection Error", error);
        process.exit(1);
    }
}
