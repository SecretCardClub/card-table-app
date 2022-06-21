

class Pile {
  constructor(id, dz = { widthPer: 0, heightPer: 0 }, cards ) {
    this.id = id ||  Math.round(Math.random() * 100000);
    this.dz = dz;
    this.cards = [];
    this.color = "blue";
    this.spread = false;
  }
  addCard(card) {
    this.cards.push(card);
    return this;
  }

  spread() {
    this.spread = !this.spread;
    return this;
  }

  getCards() {
    return this.cards;
  }
}

export default Pile;
