import React, { useState, useEffect } from "react";

const SandboxContext = React.createContext({
  showPileMenu: false,
  setShowPileMenu: () => {},
  currentPile: null,
  setCurrentPile: () => {},
  cardDimensions: {},
  setCardDimensions: () => {},
  zIndexCounter: 1,
  setZIndexCounter: () => {},
});

export const SandboxContextProvider = ({ children, movables }) => {
  const [showPileMenu, setShowPileMenu] = useState(false);
  const [currentPile, setCurrentPile] = useState(null);
  const [cardDimensions, setCardDimensions] = useState(null);

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
      }}
    >
      {children}
    </SandboxContext.Provider>
  );
};

export default SandboxContext;
