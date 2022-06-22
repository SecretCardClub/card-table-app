import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";
import { Text, View, Pressable } from "react-native";

import Pile from "../classes/Pile";
import PileMenu from "./PileMenu";
import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers";

const CardPile = ({ componentState, movables, socket }) => {
  if(componentState.constructor !== 'Pile') {
    componentState = new Pile(componentState)
  }
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
        const newPile = new Pile({});
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
          dispatch: true,
        });
      }
    }
  };

  const menuFlipHandler = () => {
    let cards = [...componentState.cards];
    let faceUp = cards[0].faceUp;
    console.log("faceUP: ", faceUp)
    cards = cards.map((card) => {
      card.faceUp = !faceUp;
      return card;
    });

    const options = {
      id: componentState.id,
      type: "cards",
      updatedState: cards,
      componentState,
      movables,
      socket,
      dispatch: true,
      returnValue: true
    };
    helpers.updateComponentState(options);
    setShowMenu(false);
  };

  return (
    <>
      {showMenu && !componentState.spread && (
        <PileView
          onLayout={establishViewDimensions}
          highlighted={highlighted}
          thickness={componentState.cards.length}
          color={componentState.color}
        >
          <PileMenu
            setShowMenu={setShowMenu}
            movables={movables}
            componentState={componentState}
            socket={socket}
            menuFlipHandler={menuFlipHandler}
          />
        </PileView>
      )}
      {!showMenu && !componentState.spread && (
        <PileView
          onLayout={establishViewDimensions}
          highlighted={ctx.currentPile && ctx.currentPile.id === componentState.id}
          thickness={componentState.cards.length}
          color={componentState.color}
        >
          <Pressable
            onPressIn={onPressInHandler}
            onPressOut={onPressOutHandler}
            onPress={takeSingleCard}
            onLongPress={openMenuHandler}
          >
            {componentState.cards.length ? (
              <>
                {componentState.cards[0].faceUp && (
                <Text>{`${componentState.cards[0].rank} ${componentState.cards[0].suit}`}</Text>
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
  justify-content: space-between;
  background-color: ${({ highlighted, color }) => (highlighted ? "pink" : color)};
  border-bottom-width: ${({ thickness }) => (`${thickness/15}px`)};
  border-right-width: ${({ thickness }) => (`${thickness/22}px`)};
  border-color: black;

`;

const CardTextPressable = styled.Pressable`
  align-self: flex-start;
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
