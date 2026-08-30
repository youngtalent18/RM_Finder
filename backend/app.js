import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoute from "./routes/userRoute.js"
import profileRoute from "./routes/profileRoute.js"
import roommateRoute from "./routes/roommateRoute.js"
import preferenceRoute from "./routes/preferenceRoute.js"
import adminRoute from "./routes/adminRoute.js"
import messageRoute from "./routes/messageRoute.js";
import adminMessageRoute from "./routes/adminMessageRoute.js"
import listingRoute from "./routes/listingRoute.js"


const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({extended: true}));

app.use(morgan("dev"));

app.use("/api/auth", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/roommates", roommateRoute);
app.use("/api/preferences",preferenceRoute);
app.use("/api/admin", adminRoute);
app.use("/api/messages", messageRoute);
app.use("/api/admin/messages", adminMessageRoute);
app.use("/api/listings", listingRoute);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Welcome to Roommate finder API" });
});

export default app;
