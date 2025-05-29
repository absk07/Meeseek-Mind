import mongoose, { Mongoose, Connection } from 'mongoose';

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

// Extend globalThis to include mongoose cache
declare global {
  // Allow modifying globalThis
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export default async function connectDB(): Promise<Connection | null> {
    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env');
    }
    if(cached.conn) return cached.conn;
    if(!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI).then(mongooseInstance => mongooseInstance)
    }
    try {
        const mongooseInstance = await cached.promise;
        cached.conn = mongooseInstance.connection;
    } catch(err) {
        cached.promise = null;
        console.error("Error connecting to DB", err)
    }
    global.mongoose = cached;
    return cached.conn;
}