import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDb connected`);
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
};
