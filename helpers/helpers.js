export default helpers = {
  isDropZone: (gesture, dropZones) => {
    dropZones.forEach((dz) => {
      if (
        gesture.moveY > dz.y &&
        gesture.moveY < dz.y + dz.height &&
        gesture.moveX > dz.x &&
        gesture.moveX < dz.x + dx.width
      ) {
        return dz;
      }
    });
    return null;
  },
};
