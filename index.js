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
// ----------------------------------------
const users= {};

io.of("/chat").on('connection', socket => {
  socket.on('new-user-joined', name => {
    console.log("New user =>" , name);
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    console.log(`${name} join the chat`);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', {
      message : message,
      name : users [socket.id]
    })
  });

});
// ----------------------------------------

// Handle incoming socket connections only on the chat route
// io.of("/chat").on("connection", (socket) => {
//   // GETTING SOCKET ID
//   console.log("User connected:", socket.id);
//   const messages = [];
//   // WE CAN HAVE USERID IN OBJECT FROM FRONTEND
//   socket.on("message", (data) => {
//     messages.push(data);
//     console.log("Received message:", messages);
//   });
  
//   //REPLY
//   socket.on("reply", (data) => {    
//     messages.push(data);
//     console.log("Received reply:", messages);
   
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);

//     messages.forEach(async (message) => {
//       await testSavingtoDB(message);
//     });

//   });
// });




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

//ROUTES
app.use("/api", require("./Apps/routes/app.routes"));

//PORT
const myServer = server.listen(port, console.log(`Connecte to port ${port}`));
module.exports = io;
module.exports = { myServer };
