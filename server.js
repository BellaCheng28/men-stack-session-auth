import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import mongoose from "mongoose";
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";

import authRouter from "./controllers/auth.js";
import profileRouter from "./controllers/profile.js";
import MongoStore from "connect-mongo";

import validSession from "./middleware/validSession.js";

import passUserToView from "./middleware/pass-user-to-view.js";

// Set the port from environment variable or default to 3000
const port = process.env.PORT || "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan("dev"));
// Middleware for handling sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
  })
);

app.use(passUserToView);

// Routes
app.get("/", (req, res) => {
  res.render("index.ejs", { user: req.session.user });
});

app.get("/vip-lounge", validSession,(req,res)=>{
  res.send(`welcome to the party ${req.session.user.username}`);
});

// http://localhost:3000/auth/sing-up
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
