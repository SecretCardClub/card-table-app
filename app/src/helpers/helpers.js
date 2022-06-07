import Pile from "../classes/Pile";

const helpers = {
  isDropZone: (gesture, piles, pileId) => {
    let id = false;
    console.log('isDropZone ', { piles })
    Object.values(piles).forEach((pile) => {
      let returnedId = pile.isInDropZone(gesture);
      if (returnedId && pile.id !== pileId) {
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
