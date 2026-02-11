export default class Game {
  static STATUSES = ["Idle", "Starting", "Active"];

  #players = new Map();
  #questions;
  #status = "Idle";
  #currentQuestionIndex = 0;

  constructor(questions) {
    this.#questions = questions;
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

  get playerCount() {
    return this.#players.size;
  }

  get playerEntries() {
    return [...this.#players.entries()];
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

  getQuestion() {
    if (this.#currentQuestionIndex >= this.#questions.length) {
      return null;
    }
    return this.#questions[this.#currentQuestionIndex++];
  }

  reset() {
    this.#players.clear();
    this.#currentQuestionIndex = 0;
    this.setStatus("Idle");
  }
}
