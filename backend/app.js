if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection: ", reason.message || reason);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: ", err.message || err);
});

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

//for session package pupose
const session = require("express-session");
const MongoStore = require("connect-mongo");

const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user.js");

// Routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const ExpressError = require("./utils/ExpressError.js");

const dbUrl = process.env.ATLASDB_URL;

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, postman) or matching patterns
    if (!origin || 
        origin.startsWith("http://localhost") || 
        origin.startsWith("http://127.0.0.1") || 
        origin.endsWith("vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Mongo SESSION STORE", err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax", // Safe defaults for cross-origin session storage on local machine
    secure: false    // localhost is not HTTPS
  },
};

app.use(session(sessionOption));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Mount API routes
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api", userRouter);

// Database connection
mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error: ", err.message);
});

main()
  .then(() => {
    console.log("Connection successfully");
  })
  .catch((err) => {
    console.log("Database initial connection error: ", err.message);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// 404 Route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// JSON Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).json({ error: message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is started on port " + PORT);
});
