class Card {
  constructor(suit, rank, faceUp = false) {
    this.id = Math.random();
    this.suit = suit;
    this.rank = rank;
    this.faceUp = faceUp;
  }
  flip() {
    this.faceUp = !this.faceUp;
    return this;
  }

}

export default Card;
