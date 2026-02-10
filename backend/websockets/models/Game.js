export default class Game {
  static STATUSES = ["idle", "active"];

  #players = new Map();
  #questions;
  #status = "idle";
  #currentQuestionIndex = 0;

  constructor(questions) {
    this.#questions = questions;
  }

  // Status
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

  // Players
  get playerCount() {
    return this.#players.size;
  }

  get playerEntries() {
    return [...this.#players.entries()];
  }

  get leaderboard() {
    return [...this.#players.entries()].sort((a, b) => b[1].score - a[1].score);
  }

  addPlayer(player) {
    this.#players.set(player.id, player);
  }

  getPlayer(id) {
    return this.#players.get(id);
  }

  removePlayer(id) {
    return this.#players.delete(id);
  }

  checkNameAvailability(name) {
    for (const [, player] of this.#players) {
      if (player.name.toLowerCase() === name.toLowerCase()) {
        return false;
      }
    }
    return true;
  }

  // Questions
  getQuestion() {
    if (this.#currentQuestionIndex >= this.#questions.length) {
      return null;
    }
    return this.#questions[this.#currentQuestionIndex++];
  }

  // Game control
  reset() {
    this.#players.clear();
    this.#currentQuestionIndex = 0;
    this.#status = "idle";
  }
}
