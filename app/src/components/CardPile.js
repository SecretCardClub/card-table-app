import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";
import { Text, View, Pressable, Image } from "react-native";

import Device from '../appState/Device'
import Pile from "../classes/Pile";
import PileMenu from "./PileMenu";
import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers";
import HA from "../assets/cards/HA.png";

const CARD_LAYOUT = {
  width: 100,
  height: 140,
}


const CardPile = ({ componentState, movables, socket }) => {
  if(componentState.constructor !== 'Pile') {
    componentState = new Pile(componentState);
  }
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const establishViewDimensions = (e) => {
    if (!ctx.cardDimensions) {

      let layout, deviceHeight, deviceWidth;
      if(Device.OS !== 'web') {
        deviceHeight = Device.Dims.height
        deviceWidth = Device.Dims.width
        layout = CARD_LAYOUT;

      }
      else {
        deviceHeight = window.innerHeight
        deviceWidth = window.innerWidth
        layout = e.nativeEvent.layout;
      }
      const cardDimensions = {
        cardWidthPer: layout.width / deviceWidth,
        cardHeightPer: layout.height / deviceHeight,
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
        const newPile = new Pile({color: componentState.color});
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
      {showMenu && (
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
      {!showMenu && (
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
                <StyledImage source={require(`../assets/cards/${componentState.cards[0].suit}${componentState.cards[0].rank}.png`)} />
                )}
                {!componentState.cards[0].faceUp && (
                <StyledImage source={require('../assets/cards/blueBack2.png')} />
                )}
                <Text>{componentState.cards.length}</Text>

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
  width: ${CARD_LAYOUT.width}px;
  height: ${CARD_LAYOUT.height}px;
  display: flex;
  position: relative;
  z-index: 10;

  padding-left: 25px;
  padding-right: 25px;
  border-radius: 5px;
  align-items: center;
  justify-content: space-between;
  background-color: whitesmoke;
  /* background-color: ${({ highlighted, color }) => (highlighted ? "pink" : color)}; */
  border-bottom-width: ${({ thickness }) => (`${thickness/15}px`)};
  border-right-width: ${({ thickness }) => (`${thickness/22}px`)};
  box-shadow: 1px 1px ${({ thickness }) => (thickness > 9 ? `${5 + thickness/5}px` : `${thickness / 2}px`)} #8b8c8c;
  border-color: black;

`;

const StyledImage = styled.Image`
  width: ${CARD_LAYOUT.width}px;
  height: ${CARD_LAYOUT.height}px;
  z-index: 1000;
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
