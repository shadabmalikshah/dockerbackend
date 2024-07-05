const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const dbConnect = () => {
  try {
    const conn = mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected successfully");
  } catch (error) {
    console.log("Database Error");
  }
};

module.exports = dbConnect;

