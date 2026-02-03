import { Server } from "socket.io";
import eiows from "eiows";

export function startGameserver() {
  const io = new Server(3000, {
    wsEngine: eiows.Server,
    cors: {
      origin: "*",
    },
  });

  let users = [];

  io.on("connection", (socket) => {
    socket.on("joinGame", (playerName) => {
      users.push({ name: playerName, id: socket.id });
      io.emit("updateUsers", users.map((u) => u.name).sort());
    });

    socket.on("disconnect", () => {
      users = users.filter((u) => u.id !== socket.id);
      io.emit("updateUsers", users.map((u) => u.name).sort());
    });
  });

  return io;
}
