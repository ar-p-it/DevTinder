const socketIO = require("socket.io");
const { Chat } = require("../models/chat");
const User = require("../models/user"); // Required for enrichment

const initialiseSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173", // Update for prod
      credentials: true,
    },
    transports: ["websocket", "polling"],
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // Join chat room
    socket.on("joinChat", async ({ firstName, lastName, userId, toUserId }) => {
      if (!userId || !toUserId) {
        console.error("Invalid joinChat parameters");
        return;
      }

      const roomId = [userId, toUserId].sort().join("_");
      socket.join(roomId);
      console.log(`👥 User ${firstName} ${lastName} joined room ${roomId}`);
    });

    // Handle new message
    socket.on("sendMessage", async ({ firstName, lastName, userId, toUserId, text }) => {
      try {
        if (!text?.trim() || !userId || !toUserId) {
          throw new Error("Invalid message parameters");
        }

        const roomId = [userId, toUserId].sort().join("_");
        
        // Find or create chat
        let chat = await Chat.findOne({
          participants: { $all: [userId, toUserId] }
        });

        if (!chat) {
          chat = new Chat({
            participants: [userId, toUserId],
            messages: []
          });
        }

        // Save to DB (minimal structure)
        const newMessage = {
          senderId: userId,
          text: text.trim(),
          createdAt: new Date()
        };
        chat.messages.push(newMessage);
        await chat.save();

        // GET SENDER'S CURRENT PROFILE (handles name changes)
        const sender = await User.findById(userId).select("firstName lastName");
        
        // EMIT UNIFIED STRUCTURE TO ALL ROOM MEMBERS
        const payload = {
          _id: newMessage._id,
          senderId: {
            _id: userId,
            firstName: sender?.firstName || firstName,
            lastName: sender?.lastName || lastName
          },
          text: newMessage.text,
          createdAt: newMessage.createdAt
        };

        io.to(roomId).emit("messageReceived", payload);
        console.log(`📨 Message sent in room ${roomId} by ${userId}`);
      } catch (err) {
        console.error("❌ Send message error:", err);
        // Optional: emit error to client
        // socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = { initialiseSocket };