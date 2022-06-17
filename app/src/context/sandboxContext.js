import React, { useState } from "react";

import Pile from "../classes/Pile"
import Card from "../classes/Card"

const SandboxContext = React.createContext({
  // showPileMenu: false,
  // setShowPileMenu: () => {},
  currentPile: {},
  setCurrentPile: () => {},
});

export const SandboxContextProvider = (props) => {
  // const [showPileMenu, setShowPileMenu] = useState(false);
  const [currentPile, setCurrentPile] = useState({id: null});



  return (
    <SandboxContext.Provider
      value={{
        currentPile,
        setCurrentPile,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;





// const addPile = (pile) => {
//   setPiles(currentPiles => {
//     return { ...currentPiles, [pile.id]: pile};
//   });
// };

// const updatePileDz = (pan, pileId) => {
//   if (piles[pileId]) {
//     const updatedPile = piles[pileId].updateDz(pan)
//     setPiles({...piles, [pileId]: updatedPile});
//   }
// };

// const concatenateCards = (pileId, dzId) => {
//   if (piles[pileId] && piles[dzId]) {
//     const updatedPile = piles[dzId].concatenateCards(piles[pileId].cards);
//     let updatedPiles = {...piles, [pileId]: updatedPile};
//     delete updatedPiles[pileId];
//     setPiles(updatedPiles);

//   }
// };

// const initalizeDz = (dz, pileId) => {
//   if (piles[pileId]) {
//     const updatedPile = piles[pileId].initalizeDz(dz);
//     const updatedPiles = {...piles, [pileId]: updatedPile};
//     setPiles(updatedPiles);
//   }
// }