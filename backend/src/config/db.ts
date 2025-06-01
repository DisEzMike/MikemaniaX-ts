import mongoose from "mongoose";
import { DB_URL } from "../utils/contant";


export const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('DB Connected')
    } catch (error) {
        console.error(error)
    }
}