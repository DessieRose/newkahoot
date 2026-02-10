export default class Game {
  #players = new Map();
  #questions;
  #status = "idle";
  #currentQuestionIndex = 0;
  #gameOver = false;

  static STATUSES = ["idle", "active"];

  constructor(questions) {
    this.#questions = questions;
  }

  getQuestion() {
    if (this.#currentQuestionIndex >= this.#questions.length) {
      this.#gameOver = true;
      return null;
    }
    return this.#questions[this.#currentQuestionIndex++];
  }

  checkNameAvailability(name) {
    for (const [, player] of this.#players) {
      if (player.name.toLowerCase() === name.toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  addPlayer(player) {
    this.#players.set(player.id, player);
  }

  getPlayer(id) {
    return this.#players.get(id);
  }

  reset() {
    this.#players.clear();
    this.#currentQuestionIndex = 0;
    this.#gameOver = false;
    this.#status = "idle";
  }

  get status() {
    return this.#status;
  }

  setStatus(status) {
    if (!Game.STATUSES.includes(status)) {
      throw new Error(
        `Invalid status: ${status}. Must be one of: ${Game.STATUSES.join(", ")}`,
      );
    }
    this.#status = status;
    return this.#status;
  }

  get playerEntries() {
    return [...this.#players.entries()];
  }

  get leaderboard() {
    return [...this.#players.entries()].sort((a, b) => b[1].score - a[1].score);
  }

  get gameOver() {
    return this.#gameOver;
  }

  removePlayer(id) {
    return this.#players.delete(id);
  }

  get playerCount() {
    return this.#players.size;
  }
}
