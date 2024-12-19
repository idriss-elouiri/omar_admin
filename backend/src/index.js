import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./modules/auth/auth.route.js";
import productRouter from "./modules/product/product.route.js";
import orderRouter from "./modules/order/order.route.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

connectDb();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.FRONTEND_URL2,
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests with no `Origin` (e.g., Postman)
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable credentials
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
  })
);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("FRONTEND_URL2:", process.env.FRONTEND_URL2);

app.use((req, res, next) => {
  console.log("Origin Header:", req.headers.origin);
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.url);
  next();
});


// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start server
const PORT = process.env.PORT || 3005;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
