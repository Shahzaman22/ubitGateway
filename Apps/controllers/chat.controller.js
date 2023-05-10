const http = require('http');
const express = require('express');
const router = express.Router();
const Chat = require('../model/chat');
const server = http.createServer(router);
const io = require('socket.io')(server);

// Create a new chat message
exports.postChat = async (req, res) => {
  const { receiverId, message } = req.body;
  const senderId = req.user.userId;

  try {
    const chat = new Chat({
      sender: senderId,
      receiver: receiverId,
      message
    });

    await chat.save();

    // Emit the message to the receiver
    io.to(receiverId).emit('message', chat);

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send message');
  }
};

// Add socket.io event handlers
io.on('connection', (socket) => {
  console.log('User connected');

  // Handle incoming messages
  socket.on('message', async ({ receiverId, message }) => {
    const senderId = socket.rooms[0]; // The sender is the first room that the socket joined

    try {
      const chat = new Chat({
        sender: senderId,
        receiver: receiverId,
        message
      });

      await chat.save();

      // Emit the message to the receiver
      io.to(receiverId).emit('message', chat);

      socket.emit('message', chat);
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to send message');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

