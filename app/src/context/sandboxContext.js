import React, { useState, useEffect } from "react";


const SandboxContext = React.createContext({
  showPileMenu: false,
  setShowPileMenu: () => {},
  currentPile: null,
  setCurrentPile: () => {},
  cardDimensions: {},
  setCardDimensions: () => {},
});

export const SandboxContextProvider = (props) => {
  const [showPileMenu, setShowPileMenu] = useState(false);
  const [currentPile, setCurrentPile] = useState(null);
  const [cardDimensions, setCardDimensions] = useState(null);

  let timer;
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      setCurrentPile(null);
    }, 2500);
    return () => {
      clearTimeout(timer);
    }
  }, [currentPile]);

  return (
    <SandboxContext.Provider
      value={{
        showPileMenu,
        setShowPileMenu,
        currentPile,
        setCurrentPile,
        cardDimensions,
        setCardDimensions,
      }}
    >
      {props.children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
