export default class Player {
  id;
  name;

  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.points = 0;
  }

  addPoint() {
    this.points++;
  }
}
