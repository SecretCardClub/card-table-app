class Pile {
  constructor(dz) {
    this.id = Math.random();
    this.dz = dz;
    this.cards = [];
  }
  isInDropZone(gesture) {
    if (
      gesture.moveY > this.dz.top &&
      gesture.moveY < this.dz.top  + this.dz.height &&
      gesture.moveX > this.dz.left  &&
      gesture.moveX < this.dz.left + this.dz.x + this.dz.width
    ) {
      return this.id;
    }
    return false;
  }

  addCard(card) {
    this.cards.push(card);
    return this.cards;
  }

  removeCard(id) {
    this.cards = this.cards.filter((card) => card.id !== id);
    return this.cards;
  }

  getCards() {
    return this.cards;
  }

  updateDz(pan) {
    this.dz.top += pan.y._value;
    this.dz.left += pan.x._value;
    return this;
  }
}

export default Pile;
