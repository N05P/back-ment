import mongoose from "mongoose";

let cache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cache;
}

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
    if (cache.conn) return cache.conn;

    if (!cache.promise) {
        if (!MONGODB_URI) {
            throw new Error("Please provide a valid MongoDB URI");
        }

        const options = {
            bufferCommands: true,
        };

        cache.promise = mongoose
            .connect(MONGODB_URI, options)
            .then((mongooseInstance) => mongooseInstance);
    }

    try {
        cache.conn = await cache.promise;
    } catch (err) {
        cache.promise = null;
        throw err;
    }

    return cache.conn;
}

export default connectDB;
