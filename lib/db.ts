/**
 * MongoDB Connection Manager
 * Ensures a single cached connection across the app (Next.js / serverless safe)
 */

import mongoose, { ConnectOptions } from "mongoose";

/* -------------------------------------------------------------------------- */
/*                                Types                                       */
/* -------------------------------------------------------------------------- */

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

/* -------------------------------------------------------------------------- */
/*                             Global Cache Setup                             */
/* -------------------------------------------------------------------------- */

declare global {
  // eslint-disable-next-line no-var
  var __mongoose_cache__: MongooseCache | undefined;
}

const globalCache: MongooseCache =
  global.__mongoose_cache__ ?? {
    conn: null,
    promise: null,
  };

if (!global.__mongoose_cache__) {
  global.__mongoose_cache__ = globalCache;
}

/* -------------------------------------------------------------------------- */
/*                             Config Utilities                               */
/* -------------------------------------------------------------------------- */

const getMongoURI = (): string => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("❌ MONGODB_URI is not defined");
  return uri;
};

const getMongoOptions = (): ConnectOptions => ({
  dbName: process.env.MONGODB_DB ?? "portfolio",

  bufferCommands: false,

  // 🔥 Important for M0 cluster
  maxPoolSize: Number(process.env.MONGODB_MAX_POOL_SIZE ?? 2),
  minPoolSize: 0,

  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
});

/* -------------------------------------------------------------------------- */
/*                          Connection Core Function                          */
/* -------------------------------------------------------------------------- */

export async function connectDB(): Promise<typeof mongoose> {
  // ✅ Reuse existing connection
  if (globalCache.conn && mongoose.connection.readyState === 1) {
    return globalCache.conn;
  }

  // ✅ Create connection if not exists
  if (!globalCache.promise) {
    console.log("🟡 Creating new MongoDB connection...");

    globalCache.promise = mongoose
      .connect(getMongoURI(), getMongoOptions())
      .then((mongooseInstance) => {
        console.log("🟢 MongoDB connected");
        return mongooseInstance;
      })
      .catch((error) => {
        globalCache.promise = null;
        console.error("🔴 MongoDB connection error:", error);
        throw error;
      });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

/* -------------------------------------------------------------------------- */
/*                           Optional: Disconnect                             */
/* -------------------------------------------------------------------------- */

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    globalCache.conn = null;
    globalCache.promise = null;
    console.log("⚪ MongoDB disconnected");
  }
}