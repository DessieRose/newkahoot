export default class Player {
  id;
  name;
  score;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.score = 0;
  }

  get name() {
    return this.name;
  }

  get score() {
    return this.score;
  }

  addPoint() {
    this.score += 10;
  }
}
