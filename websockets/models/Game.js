import Player from "./Player.js";

export default class Game {
  #players = new Map();
  #questions;
  #currentQuestion;
  #status = "Idle";
  #io;
  #currentQuestionIndex = 0;
  #currentAnswers = new Map();
  #questionTimer = null;

  constructor(questions, io) {
    this.#questions = questions;
    this.#io = io;
  }

  syncClient(socket) {
    socket.emit("status_update", { message: this.#status });
    socket.emit(
      "updateUsers",
      [...this.#players.values()].map((p) => p.name).sort(),
    );
  }

  get status() {
    return this.#status;
  }

  get playerCount() {
    return this.#players.size;
  }

  get leaderboard() {
    const sorted = [...this.#players.entries()].sort(
      (a, b) => b[1].score - a[1].score,
    );

    const grouped = [];
    for (const [, player] of sorted) {
      const last = grouped[grouped.length - 1];
      if (last && last.score === player.score) {
        last.names.push(player.name);
      } else {
        grouped.push({ score: player.score, names: [player.name] });
      }
    }

    return grouped.map((group) => ({
      score: group.score,
      name: group.names.join(" & "),
    }));
  }

  #setStatus(status) {
    this.#status = status;
    this.#io.emit("status_update", { message: status });
  }

  broadcastStatus() {
    this.#io.emit("status_update", { message: this.#status });
  }

  broadcastUsers() {
    this.#io.emit(
      "updateUsers",
      [...this.#players.values()].map((p) => p.name).sort(),
    );
  }

  joinPlayer(socketId, name, callback) {
    if (!name?.trim()) {
      return callback?.({ success: false, error: "Name required" });
    }
    if (!this.checkNameAvailability(name)) {
      return callback?.({ success: false, error: "Name already taken" });
    }
    this.#players.set(socketId, new Player(socketId, name));
    this.broadcastUsers();
  }

  checkNameAvailability(name) {
    return ![...this.#players.values()].some(
      (p) => p.name.toLowerCase() === name.toLowerCase(),
    );
  }

  removePlayer(id) {
    this.#players.delete(id);
    this.#currentAnswers.delete(id);
    this.broadcastUsers();

    if (
      this.#status === "Active" &&
      this.#currentAnswers.size >= this.playerCount
    ) {
      this.nextQuestion();
    }
  }

  nextQuestion() {
    clearTimeout(this.#questionTimer);
    this.#currentAnswers.clear();

    if (this.#currentQuestionIndex >= this.#questions.length) {
      this.#setStatus("Finished");
      this.#io.emit("gameEnd", this.leaderboard);
      this.reset();
      return;
    }

    this.#currentQuestion = this.#questions[this.#currentQuestionIndex++];
    console.log("📤 Sending question:", this.#currentQuestion.question);
    this.#io.emit("newQuestion", this.#currentQuestion);
    this.#questionTimer = setTimeout(
      () => this.nextQuestion(),
      this.#currentQuestion.timeLimit * 1000,
    );
  }

  submitAnswer(socketId, answer) {
    const player = this.#players.get(socketId);
    if (!player) return;

    console.log(`Player ${player.name} answered:`, answer.text);

    if (answer === this.#currentQuestion.correctAnswerId) player.addScore();

    this.#currentAnswers.set(socketId, answer);
    if (this.#currentAnswers.size === this.playerCount) {
      console.log("✅ All players answered!");
      this.nextQuestion();
    }
  }

  startGame(callback) {
    if (this.playerCount < 2) {
      return callback?.({
        success: false,
        error: "Need at least 2 players to start",
      });
    }

    console.log("🎮 Game starting in 3 seconds!");
    this.#setStatus("Starting");
    callback?.({ success: true });

    const countdown = (seconds) => {
      this.#io.emit("countdown", seconds);
      if (seconds > 0) {
        setTimeout(() => countdown(seconds - 1), 1000);
      } else {
        this.#setStatus("Active");
        this.#io.emit("gameStarted");
        this.nextQuestion();
      }
    };

    countdown(3);
  }

  reset() {
    clearTimeout(this.#questionTimer);
    this.#questionTimer = null;
    this.#currentAnswers.clear();
    this.#players.clear();
    this.#currentQuestion = null;
    this.#currentQuestionIndex = 0;
    this.#setStatus("Idle");
  }

  restart() {
    console.log("🔄 Restarting game...");
    this.reset();
    this.#io.emit("reloadPage");
  }
}

// Comment: this coment is for code review purposes.