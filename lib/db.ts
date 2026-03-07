/**
 * MongoDB connection utility.
 * Keeps a cached connection across hot reloads and avoids throwing during module import.
 */

import mongoose from "mongoose";
import dns from "node:dns"

// import dns from "node:dns/promises"

dns.setServers(["8.8.8.8", "1.1.1.1"])


type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectDB() {
  console.log(await dns.getServers())
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error("Please define MONGODB_URI in .env")
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, {
      dbName: "portfolio",
      bufferCommands: false
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
