import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import clientsRoutes from "./routes/clientsRoutes.js";
import generateInvoiceRoutes from "./routes/generateInvoiceRoutes.js";
import servicesRoutes from "./routes/serviesRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";


configDotenv();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin: true,
  credentials: true,
}));

// // 🔥 DB middleware (safe for serverless)
// app.use(async (req, res, next) => {
//   await connectDB();
//   next();
// });

// // ✅ test route (IMPORTANT)
// app.get("/", (req, res) => {
//   res.status(200).json({ success: true, message: "API working" });
// });

app.get("/", (req, res) => {
  res.json({ message: "DB OK" });
});

// DB connect middleware (Must be ABOVE routes)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(500).json({ error: "DB FAILED" });
  }
});

app.use("/auth", authRoutes);
app.use(clientsRoutes);
app.use(generateInvoiceRoutes);
app.use(servicesRoutes);
app.use(analyticsRoutes);

export default app;
