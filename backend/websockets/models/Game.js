export default class Game {
  #players = new Map();
  constructor() {}
  addPlayer(player) {
    this.#players.set(player.id, player);
  }
  getPlayer(id) {
    return this.#players.get(id);
  }

  get playerEntries() {
    return [...this.#players.entries()];
  }

  removePlayer(id) {
    return this.#players.delete(id);
  }
  get playerCount() {
    return this.#players.size;
  }
}
