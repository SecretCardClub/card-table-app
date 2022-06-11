

class Pile {
  constructor(id, dz = { top: 0, left: 0 }, cards ) {
    this.id = id ||  Math.round(Math.random() * 100000);
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
    return this;
  }

  concatenateCards(cards) {
    this.cards = [...cards, ...this.cards];
    return this;
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

  initalizeDz(dz) {
    this.dz = dz;
    return this;
  }
}

export default Pile;
