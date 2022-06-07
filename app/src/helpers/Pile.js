
class Pile {
  constructor(dz) {
    this.id = Math.random();
    this.dz = dz;
    this.cards = [];
  }
  isInDropZone(gesture) {
      if (
        gesture.moveY > this.dz.y &&
        gesture.moveY < this.dz.y + this.dz.height &&
        gesture.moveX > this.dz.x &&
        gesture.moveX < this.dz.x + this.dz.width
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
      this.cards = this.cards.filter(card => card.id !== id);
      return this.cards;
    }

    getCards() {
      return this.cards;
    }
  }

  export default Pile;
