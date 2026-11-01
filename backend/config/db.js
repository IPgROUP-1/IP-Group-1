const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const mongoUrl = process.env.MONGO_URI || process.env.MONGO_DB_URL;
  if (!mongoUrl) {
    throw new Error("Missing MongoDB connection string. Set MONGO_URI or MONGO_DB_URL in backend/.env");
  }

  await mongoose.connect(mongoUrl);
  console.log("MongoDB connected");
};