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
const { testSavingtoDB } = require("./Apps/controllers/chat.controller");
const port = process.env.PORT || 4000;

// Handle incoming socket connections only on the chat route
io.of("/chat").on("connection", (socket) => {
  // GETTING SOCKET ID
  console.log("User connected:", socket.id);
  const messages = [];
  // WE CAN HAVE USERID IN OBJECT FROM FRONTEND
  socket.on("message", (data) => {
    // console.log("Received message:", message);
    messages.push(data);
    console.log("Received message:", messages);

    // testSavingtoDB(data);

    // Handle the message here and send a response if needed
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    messages.forEach(async (message) => {
      await testSavingtoDB(message);
    });
  });
  // Handle incoming chat messages
  // socket.on("send_message", (data) => {
  //   console.log("Received message:", data);
  //   // Broadcast the message to all connected clients
  //   // io.of('/chat').emit('receive_message', {
  //   //   user: data.user,
  //   //   text: data.text
  //   // });
  // });
});

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
// io.on("connection", (socket) => {
//   console.log("a user connecteddddddd");
//   socket.on('message', (message) => {
//     console.log(`Received message from client ${socket.id}:`, message)});
// });

//ROUTES
app.use("/api", require("./Apps/routes/app.routes"));

//PORT
const myServer = server.listen(port, console.log(`Connecte to port ${port}`));
module.exports = io;
// module.exports = io;
module.exports = { myServer };
