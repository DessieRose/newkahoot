import { Server } from "socket.io";
import eiows from "eiows";
import Game from "./models/Game.js";
import { questions } from "./data/questions.js";

export function startGameserver(server) {
  const io = new Server(server, {
    wsEngine: eiows.Server,
    cors: { origin: "*" },
  });

  const game = new Game(questions, io);

  io.on("connection", (socket) => {
    game.syncClient(socket);

    socket.on("joinGame", (name, cb) => game.joinPlayer(socket.id, name, cb));
    socket.on("admin_start_game", (cb) => game.startGame(cb));
    socket.on("checkName", (name, cb) => cb(game.checkNameAvailability(name)));
    socket.on("admin_restart_system", () => game.restart());
    socket.on("submitAnswer", (answer) => game.submitAnswer(socket.id, answer));
    socket.on("disconnect", () => game.removePlayer(socket.id));
  });

  return io;
}
