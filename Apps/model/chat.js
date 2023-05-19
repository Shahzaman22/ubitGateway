const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  message: Array,
  sender: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  user: String,
  message: Array,
  replies: [replySchema],
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
