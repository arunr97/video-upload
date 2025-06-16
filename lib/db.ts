import mongoose from 'mongoose';
import { cache } from 'react';

const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error('🔴MongoDB URL is not defined in environment variables');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URL, {
        bufferCommands: true,
        maxPoolSize: 5, // Adjust as needed
      })
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    console.log('🟢Connected to MongoDB successfully');
    return cached.conn;
  } catch (error) {
    console.error('🔴Error connecting to MongoDB:', error);
    cached.promise = null; // Reset the promise on error
  }
}
