import Pile from "../classes/Pile";

const helpers = {
  isDropZone: (gesture, movables, pileId) => {
    let id = false;
    console.log('isDropZone ', { movables })
    Object.values(movables).forEach((movable) => {
      const pile = movable.componentState
      console.log({ pile })
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
