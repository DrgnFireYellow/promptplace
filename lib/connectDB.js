import mongoose from "mongoose";

export default async function connectDB() {
  if (!global.db) {
    global.db = await mongoose.connect(process.env.MONGODB_URL);
  }
  return global.db;
}
