import Pile from "./Pile";

const helpers = {
  isDropZone: (gesture, piles) => {
    let id = false;
    piles.forEach((pile) => {
      console.log(pile)
      let returnedId = pile.isInDropZone(gesture);
      if (returnedId) {
        id = returnedId;
      }
    });
    return id;
  },

  instantiatePile: (dz) => {
    return new Pile(dz);
  },
};

export default helpers;
