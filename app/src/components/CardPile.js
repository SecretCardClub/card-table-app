import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components/native";
import { Text, View, Pressable, Image } from "react-native";

import Device from "../appState/Device";
import Pile from "../classes/Pile";
import PileMenu from "./PileMenu";
import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers";
import cardIndex from "../assets/cards/cardIndex.js";

const CARD_LAYOUT = {
  width: 100,
  height: 140,
};

const CardPile = ({ componentState, movables, socket }) => {
  if (componentState.constructor !== "Pile") {
    componentState = new Pile(componentState);
  }
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const key = `${componentState.cards[0].suit}${componentState.cards[0].rank}`;
  const cardImage = cardIndex[key];

  const establishViewDimensions = (e) => {
    if (!ctx.cardDimensions) {
      let layout, deviceHeight, deviceWidth;
      if (Device.OS !== "web") {
        deviceHeight = Device.Dims.height;
        deviceWidth = Device.Dims.width;
        layout = CARD_LAYOUT;
      } else {
        deviceHeight = window.innerHeight;
        deviceWidth = window.innerWidth;
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
        const newPile = new Pile({ color: componentState.color });
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
      returnValue: true,
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
          highlighted={
            ctx.currentPile && ctx.currentPile.id === componentState.id
          }
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
                  <StyledImage source={cardImage} />
                )}
                {!componentState.cards[0].faceUp && (
                  <StyledImage
                    source={require("../assets/cards/blueBack2.png")}
                  />
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
  background-color: ${({ highlighted, color }) =>
    highlighted ? "pink" : color};
  background-color: whitesmoke;
  border-bottom-width: ${({ thickness }) => `${thickness / 15}px`};
  border-right-width: ${({ thickness }) => `${thickness / 22}px`};
  box-shadow: 1px 1px
    ${({ thickness }) =>
      thickness > 9 ? `${5 + thickness / 5}px` : `${thickness / 2}px`}
    #8b8c8c;
  border-color: black;
`;

const StyledImage = styled.Image`
  width: ${CARD_LAYOUT.width}px;
  height: ${CARD_LAYOUT.height - 2}px;
  z-index: 1000;
  border-radius: 5px;
`;

// const CardTextPressable = styled.Pressable`
//   align-self: flex-start;
// `;

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

// const keyTable = {
//   "HA": "../assets/cards/HA.png",
//   "H2": "../assets/cards/H2.png",
//   "H3": "../assets/cards/H3.png",
//   "H4": "../assets/cards/H4.png",
//   "H5": "../assets/cards/H5.png",
//   "H6": "../assets/cards/H6.png",
//   "H7": "../assets/cards/H7.png",
//   "H8": "../assets/cards/H8.png",
//   "H9": "../assets/cards/H9.png",
//   "H10": "../assets/cards/H10.png",
//   "HJ": "../assets/cards/HJ.png",
//   "HQ": "../assets/cards/HQ.png",
//   "HK": "../assets/cards/HK.png",
//   "DA": "../assets/cards/DA.png",
//   "D2": "../assets/cards/D2.png",
//   "D3": "../assets/cards/D3.png",
//   "D4": "../assets/cards/D4.png",
//   "D5": "../assets/cards/D5.png",
//   "D6": "../assets/cards/D6.png",
//   "D7": "../assets/cards/D7.png",
//   "D8": "../assets/cards/D8.png",
//   "D9": "../assets/cards/D9.png",
//   "D10": "../assets/cards/D10.png",
//   "DJ": "../assets/cards/DJ.png",
//   "DQ": "../assets/cards/DQ.png",
//   "DK": "../assets/cards/DK.png",
//   "CA": "../assets/cards/CA.png",
//   "C2": "../assets/cards/C2.png",
//   "C3": "../assets/cards/C3.png",
//   "C4": "../assets/cards/C4.png",
//   "C5": "../assets/cards/C5.png",
//   "C6": "../assets/cards/C6.png",
//   "C7": "../assets/cards/C7.png",
//   "C8": "../assets/cards/C8.png",
//   "C9": "../assets/cards/C9.png",
//   "C10": "../assets/cards/C10.png",
//   "CJ": "../assets/cards/CJ.png",
//   "CQ": "../assets/cards/CQ.png",
//   "CK": "../assets/cards/CK.png",
//   "SA": "../assets/cards/SA.png",
//   "S2": "../assets/cards/S2.png",
//   "S3": "../assets/cards/S3.png",
//   "S4": "../assets/cards/S4.png",
//   "S5": "../assets/cards/S5.png",
//   "S6": "../assets/cards/S6.png",
//   "S7": "../assets/cards/S7.png",
//   "S8": "../assets/cards/S8.png",
//   "S9": "../assets/cards/S9.png",
//   "S10": "../assets/cards/S10.png",
//   "SJ": "../assets/cards/SJ.png",
//   "SQ": "../assets/cards/SQ.png",
//   "SK": "../assets/cards/SK.png",
// };
