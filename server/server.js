const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth');
const collectionRoutes = require('./routes/collectionRoutes');
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection Options
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    
    // Only start the server if MongoDB connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/collection", collectionRoutes);

// Fetch anime details from MyAnimeList API
app.get("/api/anime/:id", async (req, res) => {
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime/${req.params.id}`);
    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.status(500).json({ message: 'Error fetching anime details' });
  }
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!" });
});

// Protected route example
app.get("/api/user/profile", auth, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// Anime API Routes
app.get("/api/top-anime", async (req, res) => {
  try {
    const response = await axios.get("https://api.jikan.moe/v4/top/anime");
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top anime:", error);
    res.status(500).json({ error: "Failed to fetch top anime" });
  }
});

app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${query}`);
    res.json(response.data);
  } catch (error) {
    console.error("Error searching anime:", error);
    res.status(500).json({ error: "Failed to fetch search results" });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});