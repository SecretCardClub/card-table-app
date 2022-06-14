import Pile from "../classes/Pile";

const helpers = {
  isDropZone: (gesture, movables, pileId) => {
    let id = false;
    console.log('isDropZone ', { movables })
    Object.values(movables).forEach((movable) => {
      const pile = movable
      console.log({ pile })

    })
  },

  instantiatePile: (dz) => {
    return new Pile(dz);
  },
};

export default helpers;
