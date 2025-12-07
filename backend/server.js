import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Verify critical env vars are loaded
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("❌ Missing JWT_SECRET or MONGO_URI in .env file");
  process.exit(1);
}

console.log("✅ Environment variables loaded");

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import userRoutes from "./routes/userRoutes.js";
import patientRoutes from "./routes/patients/patientRoutes.js";
import doctorRoutes from "./routes/doctors/doctorRoutes.js";
import doctorAccountCreationRoutes from "./routes/tickets/doctorAccountCreationRoutes.js";
import availabilityRoutes from "./routes/doctors/availabilityRoutes.js";
import appointmentRoutes from "./routes/appointments/appointmentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import bookmarkRoutesApi from "./routes/bookmark/bookmarksApi.js";
import authRoutes from "./routes/auth/authRoutes.js";
// Setup Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/tickets/doctorCreate", doctorAccountCreationRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/follows", followRoutes);
app.use("/api/bookmarksapi", bookmarkRoutesApi);

// Start server
const PORT = process.env.PORT || 5050;

// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
