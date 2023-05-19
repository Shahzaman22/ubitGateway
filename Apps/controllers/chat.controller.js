const Chat = require("../model/chat");


// TEST CONTROLLER TO SAVE MESSAGE TO DB
exports.testSavingtoDB = async (userId, message) => {
  console.log("DATA => ", userId, message);
  const chat = new Chat({
    user: userId,
    message: message,
  });
  await chat.save();
};









