const randInt = (max = 255) => {
  return Math.floor(Math.random() * max)
}

const generateColor = () => {
  return `rgb(${randInt()}, ${randInt()}, ${randInt()})`
}


class Pile {
  constructor({ id =  Math.round(Math.random() * 100000), cards = [], color }) {
    this.id = id;
    this.cards = cards;
    this.color = color || generateColor();
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
