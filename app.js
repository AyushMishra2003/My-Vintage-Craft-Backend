import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorMiddleware from "./middleware/error.middleware.js";
import multer from "multer";
import rateLimit from "express-rate-limit";
import themeRoute from "./routes/theme.route.js";
import brandRouter from "./routes/brand.route.js";
import productRouter from "./routes/product.routes.js";
import galleryRoute from "./routes/gallery.route.js";
import bannerRoute from "./routes/Banner.route.js";
import blogRoute from "./routes/blog.route.js";
import productCategoryRouter from "./routes/productCategory.route.js";
import contactRouter from "./routes/contact.routes.js";

config();

// Initialize Express app
const app = express();


// Rate Limiter Middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 1 minute me max 10 requests allow
  message: "Betichod jaida request kar diye ",
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "Too many requests, please try again after 4 minutes.",
      retryAfter: Math.ceil(req.rateLimit.resetTime - Date.now()) + "ms" // Next retry time
    });
  }
});


// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// Sabhi API routes ke liye rate limiting lagayenge
app.use(limiter);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
         "http://localhost:5174",
      "https://vintage-craft-dashboard.netlify.app"

    ],
    credentials: true,
  })
);



app.use(morgan("dev"));


// Routes
app.use("/api/v1/theme",themeRoute)
app.use("/api/v1/brand",brandRouter)
app.use("/api/v1/product",productRouter)
app.use("/api/v1/product/category",productCategoryRouter)
app.use("/api/v1/gallery",galleryRoute)
app.use("/api/v1/banner",bannerRoute)
app.use("/api/v1/blog",blogRoute)
app.use("/api/v1/gallery",galleryRoute)
app.use("/api/v1/contact",contactRouter)



app.get("/test", (req, res) => {
  res.status(200).json({
    message: "testis running and ready.",
  });
});

// Default route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is running and ready.",
  });
});

// Catch-all route for undefined endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Oops! pagal h kya  Not Found",
  });
});

// Error handling middleware
app.use(errorMiddleware);

export default app;
