import { Server } from "socket.io";
import eiows from "eiows";
import Game from "./models/Game.js";
import Player from "./models/Player.js";
import { questions } from "./data/questions.js";

const game = new Game(questions);

export function startGameserver(server) {
  const io = new Server(server, {
    wsEngine: eiows.Server,
    cors: { origin: "*" },
  });

  let currentAnswers = new Map();
  let questionTimer = null;

  function broadcastStatus() {
    io.emit("status_update", { message: game.status });
  }

  function broadcastUsers() {
    io.emit("updateUsers", game.playerEntries.map(([, p]) => p.name).sort());
  }

  function nextQuestion() {
    clearTimeout(questionTimer);
    currentAnswers.clear();

    const question = game.getQuestion();
    if (question) {
      console.log("📤 Sending question:", question.question);
      io.emit("newQuestion", question);
      questionTimer = setTimeout(nextQuestion, question.timeLimit * 1000);
    } else {
      game.setStatus("idle");
      broadcastStatus();
      io.emit("gameEnd", game.leaderboard);
      game.reset();
    }
  }

  io.on("connection", (socket) => {
    socket.emit("status_update", { message: game.status });

    socket.on("joinGame", (playerName, callback) => {
      if (!playerName?.trim()) {
        return callback?.({ success: false, error: "Name required" });
      }
      if (!game.checkNameAvailability(playerName)) {
        return callback?.({ success: false, error: "Name already taken" });
      }

      game.addPlayer(new Player(socket.id, playerName));
      broadcastUsers();
      callback?.({ success: true });
    });

    socket.on("admin_start_game", (callback) => {
      if (game.playerCount < 2) {
        return callback?.({
          success: false,
          error: "Need at least 2 players to start",
        });
      }

      console.log("🎮 Game starting!");
      game.setStatus("active");
      broadcastStatus();
      io.emit("gameStarted");
      nextQuestion();
      callback?.({ success: true });
    });

    socket.on("checkName", (name, callback) => {
      callback(game.checkNameAvailability(name));
    });

    socket.on("admin_restart_system", () => {
      console.log("🔄 Restarting game...");
      clearTimeout(questionTimer);
      questionTimer = null;
      currentAnswers.clear();
      game.reset();
      broadcastStatus();
      io.emit("reloadPage");
    });

    socket.on("submitAnswer", (answer) => {
      const player = game.getPlayer(socket.id);
      if (!player) return;

      console.log(`Player ${player.name} answered:`, answer.text);
      if (answer.correct) {
        player.addScore();
      }

      currentAnswers.set(socket.id, answer);
      if (currentAnswers.size === game.playerCount) {
        console.log("✅ All players answered!");
        nextQuestion();
      }
    });

    socket.on("disconnect", () => {
      game.removePlayer(socket.id);
      currentAnswers.delete(socket.id);
      broadcastUsers();
    });
  });

  return io;
}
