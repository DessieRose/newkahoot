import { Server } from "socket.io";
import eiows from "eiows";

import Game from "./models/Game.js";
import Player from "./models/Player.js";

const game = new Game();

export function startGameserver() {
  const io = new Server(3000, {
    wsEngine: eiows.Server,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinGame", (playerName) => {
      game.addPlayer(new Player(socket.id, playerName));
      io.emit(
        "updateUsers",
        game.playerEntries.map(([id, p]) => p.name).sort(),
      );
    });

    socket.on("disconnect", () => {
      game.removePlayer(socket.id);
      io.emit(
        "updateUsers",
        game.playerEntries.map(([id, p]) => p.name).sort(),
      );
    });
  });

  return io;
}
