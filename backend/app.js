const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');

dotenv.config();
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/tutorials", require("./routes/tutorial.routes"));
// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/QLSV";

(async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('✅ MongoDB connected');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err.message);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect MongoDB:', err.message);
    process.exit(1);
  }
})();
