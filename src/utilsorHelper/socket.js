const { ta } = require("date-fns/locale");
const socket = require("socket.io");

const initialiseSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, toUserId }) => {
      const roomId = [userId, toUserId].sort().join("_");
      socket.join(roomId);
    });
    socket.on("sendMessage", ({firstName, userId, toUserId, text}) => {
      const roomId = [userId, toUserId].sort().join("_");
      console.log(firstName + ": " + text);
      io.to(roomId).emit("messageReceived", { firstName, text });
    });
    socket.on("disconnect", () => {});
  });
};
module.exports = { initialiseSocket };
