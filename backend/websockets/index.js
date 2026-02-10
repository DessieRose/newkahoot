import { Server } from "socket.io";
import eiows from "eiows";
import Game from "./models/Game.js";
import Player from "./models/Player.js";
import { questions } from "./data/questions.js";

const game = new Game(questions);

export function startGameserver() {
  const io = new Server(3000, {
    wsEngine: eiows.Server,
    cors: {
      origin: "*",
    },
  });

  let currentAnswers = new Map();
  let questionTimer = null;

  function nextQuestion() {
    clearTimeout(questionTimer);
    currentAnswers.clear();

    const question = game.getQuestion();

    if (question) {
      console.log("📤 Sending question:", question.question);
      io.emit("newQuestion", question);
      questionTimer = setTimeout(nextQuestion, question.timeLimit * 1000);
    } else {
      io.emit("gameEnd", game.leaderboard);
    }
  }

  io.on("connection", (socket) => {
    socket.on("joinGame", (playerName) => {
      game.addPlayer(new Player(socket.id, playerName));
      io.emit(
        "updateUsers",
        game.playerEntries.map(([id, p]) => p.name).sort(),
      );
    });

    socket.on("admin_start_game", () => {
      console.log("🎮 Game starting!");
      io.emit("gameStarted");
      nextQuestion();
    });

    socket.on("admin_restart_system", () => {
      console.log("🔄 Restarting game...");
      game.reset();
      clearTimeout(questionTimer);
      questionTimer = null;
      currentAnswers.clear();
      io.emit("reloadPage");
    });

    socket.on("submitAnswer", (answer) => {
      console.log(game.getPlayer(socket.id));
      console.log(`Player ${socket.id} answered:`, answer.text);

      if (answer.correct) {
        game.getPlayer(socket.id).addPoint();
      }

      currentAnswers.set(socket.id, answer);
      if (currentAnswers.size === game.playerEntries.length) {
        console.log("✅ All players answered!");
        nextQuestion();
      }
    });

    socket.on("disconnect", () => {
      game.removePlayer(socket.id);
      currentAnswers.delete(socket.id);
      io.emit(
        "updateUsers",
        game.playerEntries.map(([id, p]) => p.name).sort(),
      );
    });
  });

  return io;
}
