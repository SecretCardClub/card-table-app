import React, { useState } from "react";

const SandboxContext = React.createContext({
  piles: [],
  addPile: () => {},
  updatePileDz: () => {},
});

export const SandboxContextProvider = (props) => {
  const [piles, setPiles] = useState([]);

  const addPile = (pile) => {
    setPiles(piles => [...piles, pile]);
  };

  const updatePileDz = (pan, pileId) => {
    let newPile;
    let oldPiles = piles.filter(pile => pile.id !==pileId)
    piles.forEach(pile => {
      if (pile.id === pileId) {
        newPile = pile.updateDz(pan); // Is this introducting mutation bugs? I think it is.
      }
      setPiles([...oldPiles, newPile])
    })
  };

  return (
    <SandboxContext.Provider
      value={{
        piles,
        addPile,
        updatePileDz,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
