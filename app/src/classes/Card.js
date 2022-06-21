class Card {
  constructor(suit, rank) {
    this.id = Math.random();
    this.suit = suit;
    this.rank = rank;
    this.faceUp = false;
  }
  flip() {
    this.faceUp = !this.faceUp;
    return this;
  }

}



export default Card;