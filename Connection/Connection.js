import mongoose from 'mongoose';
import env from 'dotenv';
env.config();

const { MONGODB_URI } = process.env;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export { connectToDatabase };
