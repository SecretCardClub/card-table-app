import React, { useState } from "react";

import Pile from "../classes/Pile"
import Card from "../classes/Card"


// const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
// const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
// const deck = new Pile;
// for (let i = 0; i < suits.length; i++) {
//   for (let j = 0; j < ranks.length; j++) {
//     const newCard = new Card(suits[i], ranks[j]);
//     deck.addCard(newCard);
//   }
// }

const SandboxContext = React.createContext({
  piles: {},
  addPile: () => {},
  updatePileDz: () => {},
  concatenateCards: () => {},
  initalizeDz: () => {},
});

export const SandboxContextProvider = (props) => {
  const [piles, setPiles] = useState({}); // [deck.id]: deck

  const addPile = (pile) => {
    setPiles(currentPiles => {
      return { ...currentPiles, [pile.id]: pile};
    });
  };

  const updatePileDz = (pan, pileId) => {
    if (piles[pileId]) {
      const updatedPile = piles[pileId].updateDz(pan)
      setPiles({...piles, [pileId]: updatedPile});
    }
  };

  const concatenateCards = (pileId, dzId) => {
    if (piles[pileId] && piles[dzId]) {
      const updatedPile = piles[dzId].concatenateCards(piles[pileId].cards);
      let updatedPiles = {...piles, [pileId]: updatedPile};
      delete updatedPiles[pileId];
      setPiles(updatedPiles);
    }
  };

  const initalizeDz = (dz, pileId) => {
    if (piles[pileId]) {
      const updatedPile = piles[pileId].initalizeDz(dz);
      const updatedPiles = {...piles, [pileId]: updatedPile};
      setPiles(updatedPiles);
    }
  }

  return (
    <SandboxContext.Provider
      value={{
        piles,
        addPile,
        updatePileDz,
        concatenateCards,
        initalizeDz,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
