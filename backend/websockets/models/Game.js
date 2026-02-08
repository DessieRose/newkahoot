export default class Game {
  #players = new Map();
  #questions;
  #currentQuestionIndex = 0;
  #gameOver = false;

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
  }

  get playerEntries() {
    return [...this.#players.entries()];
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
