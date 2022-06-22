import React, { useState, useContext } from "react";
import styled from "styled-components/native";
import { Text, View, Pressable } from "react-native";

import Pile from "../classes/Pile";
import PileMenu from "./PileMenu";
import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers";

const CardPile = ({ componentState, movables, socket }) => {
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const establishViewDimensions = (e) => {
    if (!ctx.cardDimensions) {
      const layout = e.nativeEvent.layout;
      const cardDimensions = {
        cardWidthPer: layout.width / window.innerWidth,
        cardHeightPer: layout.height / window.innerHeight,
      };
      ctx.setCardDimensions(cardDimensions);
    }
  };

  const onPressInHandler = () => {
    setHighlighted(true);
  };

  const onPressOutHandler = () => {
    setHighlighted(false);
  };

  const openMenuHandler = () => {
    setShowMenu(true);
  };

  const takeSingleCard = () => {
    let id = componentState.id;
    if (componentState.cards.length > 1) {
      let updatedCards = [...componentState.cards];
      const takenCard = updatedCards.shift();
      let options = {
        id,
        type: "cards",
        updatedState: updatedCards,
        componentState,
        movables,
        socket,
        returnValue: true,
      };
      let updatedMovables = helpers.updateComponentState(options);
      if (ctx.currentPile) {
        id = ctx.currentPile.id;
        updatedCards = [takenCard, ...updatedMovables[id].componentState.cards];

        const options = {
          id,
          type: "cards",
          updatedState: updatedCards,
          componentState: updatedMovables[id].componentState,
          movables: updatedMovables,
          socket,
          dispatch: true,
          returnValue: true,
        };
        updatedMovables = helpers.updateComponentState(options);
        ctx.setCurrentPile(updatedMovables[id]);
      } else {
        const newPile = new Pile();
        newPile.addCard(takenCard);
        const newMovable = {
          id: newPile.id,
          component: "CardPile",
          panState: { x: 0, y: 0, x_per: 0.5, y_per: 0.5 },
          componentState: newPile,
        };
        updatedMovables = { ...updatedMovables, [newMovable.id]: newMovable };
        ctx.setCurrentPile(newMovable);
        socket.emit({
          type: socket.RT.UPDATE_TABLE,
          payload: updatedMovables,
          emitAll: true,
        });
      }
    }
  };

  const menuFlipHandler = () => {
    let cards = [...componentState.cards];
    cards = cards.map((card) => card.flip());
    const options = {
      id: componentState.id,
      type: "cards",
      updatedState: cards,
      componentState,
      movables,
      socket,
      dispatch: true,
    };
    helpers.updateComponentState(options);
  };

  return (
    <>
      {showMenu && !componentState.spread && (
        <PileView onLayout={establishViewDimensions} highlighted={highlighted}>
          <PileMenu
            setShowMenu={setShowMenu}
            movables={movables}
            componentState={componentState}
            socket={socket}
            flipMenuHandler={menuFlipHandler}
          />
        </PileView>
      )}
      {!showMenu && !componentState.spread && (
        <PileView onLayout={establishViewDimensions} highlighted={highlighted}>
          <Pressable
            onPressIn={onPressInHandler}
            onPressOut={onPressOutHandler}
            onPress={takeSingleCard}
            onLongPress={openMenuHandler}
          >
            {componentState.cards.length ? (
              <>
                {componentState.cards[0].faceUp && (
                  <Text>{componentState.cards[0].rank}</Text>
                )}
                {componentState.cards[0].faceUp && (
                  <Text>{componentState.cards[0].suit}</Text>
                )}
                <Text>{componentState.cards.length}</Text>
                {ctx.showPileMenu && <Text>Hello</Text>}
              </>
            ) : null}
          </Pressable>
        </PileView>
      )}
    </>
  );
};

export default CardPile;

const PileView = styled.View`
  width: 100px;
  height: 140px;
  display: flex;
  position: relative;
  z-index: 10;
  padding: 10px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 5px;
  align-items: center;
  justify-content: space-around;
  background-color: ${({ highlighted }) => (highlighted ? "pink" : "grey")};
`;

// let currentMovable = {...movables[ctx.currentPile.id]}
// let currentCards = [takenCard, ...currentMovable.componentState.cards];
// let currentComponentState = {...currentMovable.componentState, cards: currentCards};
// currentMovable = {...currentMovable, componentState: currentComponentState}
// updatedMovables = {...updatedMovables, [currentMovable.id]: currentMovable}
// ctx.setCurrentPile(currentMovable);

// let updatedComponentState = { ...componentState, cards: updatedCards };
// let updatedMovable = {
//   ...movables[id],
//   componentState: updatedComponentState,
// };
// let updatedMovables = { ...movables, [id]: updatedMovable };

// let updatedComponentState = { ...componentState, dz: updatedDz };
// let updatedMovable = {
//   ...movables[id],
//   componentState: updatedComponentState,
// };
// let updatedMovables = { ...movables, [id]: updatedMovable };

// socket.emit({
//   type: socket.RT.UPDATE_TABLE,
//   payload: updatedMovables,
//   emitAll: true,
// });

// const options = {
//   id,
//   type: "dz",
//   updatedState: updatedDz,
//   componentState,
//   movables,
//   socket,
//   dispatch: true,
// };
// helpers.updateComponentState(options);
