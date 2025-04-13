const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const seedUser = async () => {
  try {
    // Clear existing users (optional)
    await User.deleteMany({});

    // Create hardcoded user
    await User.create({
      email: "intern@dacoid.com",
      password: "Test123",
    });

    console.log("User seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedUser();
