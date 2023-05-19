const Chat = require("../model/chat");


// TEST CONTROLLER TO SAVE MESSAGE TO DB
// exports.testSavingtoDB = async (data) => {
//   console.log("DATA => ",data);
//   const chat = new Chat({
//     user: data.userId,
//     message: data,
//   });
//   await chat.save();
// };



exports.testSavingtoDB = async (data) => {
  // console.log("Before saving=> ", data);
  const chat = new Chat({
    user: data.userId,
    message: data,
    replies : data.replies,
  });

  if (data.replies && data.replies.length > 0) {
    // Save each reply to the chat document
    data.replies.forEach((reply) => {
      chat.replies.push({
        message: reply.message,
        sender: reply.sender,
      });
    });
    console.log("MSG =>",reply.message);
    console.log("SENDer => ",sender);
  }

  // console.log("chat =>", chat);

  await chat.save();
};




