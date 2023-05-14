const passport = require("passport");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

require("dotenv").config();
const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
  },
}); //in case server and client run on different urls
const session = require("express-session");
const path = require("path");
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(
  session({
    secret: process.env.PRIVATE_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//CORS
app.use(
  cors({
    origin: true,
  })
);

//Img Uploader
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//DB
require("./Apps/config/db");

//Socket.io
io.on("connection", (socket) => {
  console.log("a user connected");

  // Handle the message here

  // c socket.id
});

//ROUTES
app.use("/api", require("./Apps/routes/app.routes"));

//PORT
server.listen(port, console.log(`Connecte to port ${port}`));
module.exports = io;
