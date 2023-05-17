// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
// const socketIo = require("socket.io");
const cors = require("cors");
const Chat = require("../model/chat");
// const io = require('../../index')
const { myServer } = require("../../index");
const io = require("../../index");

// const io = socketIo(myServer, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

exports.get = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/index.html");
};

exports.getExecutive = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/executive.html");
};

exports.getEngineer = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/engineer.html");
};
// TEST CONTROLLER TO SAVE MESSAGE TO DB
exports.testSavingtoDB = async (data) => {
  console.log(data);
  const chat = new Chat({
    user: data.userId,
    message: data.message,
  });
  const aa = await chat.save();
  console.log("success");
};

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("message", (message) => {
//     console.log(`Received message from client ${socket.id}:`, message);
//   });
// });
// const adminNameSpace = io.of('/admin');
//   adminNameSpace.on('connect', (socket) => {
//     console.log('a user connected');
//     socket.on('join', (data) => {
//         socket.join(data.room);
//         adminNameSpace.in(data.room).emit('chat message', `New person joined the ${data.room} room`)
//     })
//     socket.on('disconnect', () => {
//         console.log('user disconnected');
//       });
//       socket.on('chat message', async (data) => {
//         console.log('message: ' + data.msg);
//         const chat = new Chat({
//           user: data.user,
//           message: data.msg,
//         });
//         await chat.save();
//         adminNameSpace.in(data.room).emit('chat message', data.msg);
//       });

//       socket.on('send message to all',async (data) => {
//         console.log('message: ' + data.msg);
//         const chat = new Chat({
//             user: data.user,
//             message: data.msg,
//           });
//           await chat.save();
//         adminNameSpace.emit('chat message', data.msg);
//       });
//   });
