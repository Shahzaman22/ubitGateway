// const Chat = require("../model/chat");
// const io = require("../../index");

exports.get = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/index.html");
};

exports.getExecutive = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/executive.html");
};

exports.getEngineer = async (req, res) => {
  await res.sendFile(__dirname + "/Frontend/engineer.html");
};

// io.on("connection", (socket) => {
//   console.log("a user connected");

//   socket.on("join", (data) => {
//     socket.join(data.room);
//     io.to(data.room).emit("chat message", `New person joined the ${data.room} room`);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });

//   socket.on("chat message", async (data) => {
//     console.log("message: " + data.msg);
//     const chat = new Chat({
//       user: data.user,
//       message: data.msg,
//     });
//     await chat.save();
//     io.to(data.room).emit("chat message", data.msg);
//   });

//   socket.on("send message to all", async (data) => {
//     console.log("message: " + data.msg);
//     const chat = new Chat({
//       user: data.user,
//       message: data.msg,
//     });
//     await chat.save();
//     io.emit("chat message", data.msg);
//   });
// });
