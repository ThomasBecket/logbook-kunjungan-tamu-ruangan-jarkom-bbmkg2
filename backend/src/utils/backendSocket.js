let io;

function pasangSocketIO(server) {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Client terhubung:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client terputus:", socket.id);
    });
  });

  return io;
}

function ambilSocketIO() {
  return io;
}

module.exports = {
  pasangSocketIO,
  ambilSocketIO,
};