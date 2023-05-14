const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = new Server(server);
const Chat = require("../model/chat");
const io = require("../..index.js");

// exports.post = async (req,res) => {
//   const chat = new  Chat({
//     user: 'test user',
//     message: 'test message',
//   });
//   await chat.save();
//   res.json(chat)
// }

exports.get = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/index.html");
};

exports.getExecutive = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/executive.html");
};

exports.getEngineer = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/engineer.html");
};

const adminNameSpace = io.of("/admin");
adminNameSpace.on("connect", (socket) => {
  console.log("a user connected");
  socket.on("join", (data) => {
    socket.join(data.room);
    adminNameSpace
      .in(data.room)
      .emit("chat message", `New person joined the ${data.room} room`);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", async (data) => {
    console.log("message: " + data.msg);
    const chat = new Chat({
      user: data.user,
      message: data.msg,
    });
    await chat.save();
    adminNameSpace.in(data.room).emit("chat message", data.msg);
  });

  socket.on("send message to all", async (data) => {
    console.log("message: " + data.msg);
    const chat = new Chat({
      user: data.user,
      message: data.msg,
    });
    await chat.save();
    adminNameSpace.emit("chat message", data.msg);
  });
});
