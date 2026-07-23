import mongoose from "mongoose";

export async function connectDB() : Promise<void>{
    const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/prep-os";
    await mongoose.connect(uri);
    console.log("[db] connected: ", mongoose.connection.name);
}