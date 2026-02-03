const socket = require("socket.io");
const { Chat } = require("../models/chat");

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("_");
      socket.join(roomId);
      console.log(`User ${firstName} joined room ${roomId}`);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, toUserId, text }) => {
        try {
          const roomId = [userId, toUserId].sort().join("_");

          let chat = await Chat.findOne({
            participants: { $all: [userId, toUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, toUserId],
              messages: [],
            });
          }

          // save message in DB
          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // ✅ emit SAME structure as DB messages
          io.to(roomId).emit("messageReceived", {
            senderId: {
              _id: userId,
              firstName,
              lastName,
            },
            text,
          });

        } catch (err) {
          console.error("Send message error:", err);
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = { initialiseSocket };
