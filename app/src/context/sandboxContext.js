import React, { useState, useEffect } from "react";

const SandboxContext = React.createContext({
  showPileMenu: false,
  setShowPileMenu: () => {},
  currentPile: null,
  setCurrentPile: () => {},
  cardDimensions: {},
  setCardDimensions: () => {},
  userAvatarDimensions: {},
  setUserAvatarDimensions: () => {},
  playerHandDimensions: {},
  setPlayerHandDimensions: () => {},
});

export const SandboxContextProvider = ({ children, movables }) => {
  const [showPileMenu, setShowPileMenu] = useState(false);
  const [currentPile, setCurrentPile] = useState(null);
  const [cardDimensions, setCardDimensions] = useState(null);
  const [userAvatarDimensions, setUserAvatarDimensions] = useState({});
  const [playerHandDimensions, setPlayerHandDimensions] = useState(null);

  let timer;
  useEffect(() => {
    if (currentPile && !movables[currentPile.id]) {
      setCurrentPile(null);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setCurrentPile(null);
      }, 2000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [movables]);


  return (
    <SandboxContext.Provider
      value={{
        showPileMenu,
        setShowPileMenu,
        currentPile,
        setCurrentPile,
        cardDimensions,
        setCardDimensions,
        userAvatarDimensions,
        setUserAvatarDimensions,
        playerHandDimensions,
        setPlayerHandDimensions,
      }}
    >
      {children}
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