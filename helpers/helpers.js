import Pile from "../classes/Pile";

const helpers = {
  isDropZone: (gesture, piles) => {
    let id = false;
    Object.values(piles).forEach((pile) => {
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
