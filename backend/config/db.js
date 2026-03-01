/**
 * Database Connection
 * -------------------
 * Connects to MongoDB using Mongoose.
 * Uses Google DNS to resolve SRV records (workaround for
 * networks where the default DNS fails to resolve Atlas SRV).
 * Exits the process on connection failure.
 */

const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google DNS for SRV lookups
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
