const server = require("../index");
const io = require("socket.io")(server);

const connection = (io) => {
  io.on("connection", (socket) => {
    console.log(socket.id, " has made a persistent connection to the server!");

    socket.on("new-message", (message) => {
      //listening for a new message.
      socket.broadcast.emit("new-message", message);
    });

    socket.on("new-channel", (channel) => {
      //listening for a new channel.
      socket.broadcast.emit("new-channel", channel);
    });
  });
};

connection(io);
