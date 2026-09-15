import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to the DB");
    return;
  }
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MongoDb URL not found");
  }
  await mongoose.connect(uri);
  console.log(`[db] connected: `, mongoose.connection.name);
}
