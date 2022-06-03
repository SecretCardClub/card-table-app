import Pile from "./Pile";

const helpers = {
  isDropZone: (gesture, dropZones) => {
    let overlap = null;
    dropZones.forEach((dz) => {
      if (
        gesture.moveY > dz.y &&
        gesture.moveY < dz.y + dz.height &&
        gesture.moveX > dz.x &&
        gesture.moveX < dz.x + dz.width
      ) {
        overlap = dz;
      }
    });
    return overlap;
  },

  instantiatePile: (dz) => {
    return new Pile(dz);
  },
};

export default helpers;
