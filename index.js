/* eslint-disable no-undef */
const passport = require("passport");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const path = require("path");
const morgan = require("morgan");
const port = process.env.PORT || 4000;

// Set up MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

store.on("error", (error) => {
  console.error("Session store error:", error);
});

app.use(morgan("dev"));
app.use(express.json());

app.use(
  session({
    secret: process.env.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Img Uploader
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// DB
require("./Apps/config/db");

// ROUTES
app.use("/api", require("./Apps/routes/app.routes"));

// PORT
const myServer = server.listen(port, console.log(`Connected to port ${port}`));

module.exports = { myServer };
