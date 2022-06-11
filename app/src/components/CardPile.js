import React, { useState } from "react";
import styled from 'styled-components/native'
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, PanResponder, Animated } from "react-native";

import helpers from "../helpers/helpers";
import Card from "../classes/Card";
import usePan from "../hooks/usePan";
import CardClass from '../classes/Card'
import Pile from '../classes/Pile'

  // const panReleaseCB = useCallback((evt, gesture, currentPan) => {
  //   let dzId = helpers.isDropZone(gesture, ctx.piles, pile.id);
  //   if (dzId) {
  //     ctx.concatenateCards(pile.id, dzId)
  //     // pan.flattenOffset();
  //   } else {
  //     ctx.updatePileDz(currentPan, pile.id);
  //     pan.flattenOffset();
  //   }
  // }, [ctx.piles, pile]);


const CardPile = ({ state }) => {


  // Making a 52 card deck
  const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  const pile = new Pile();
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      const newCard = new CardClass(suits[i], ranks[j]);
      pile.addCard(newCard);
    }
  }

  const [highlighted, setHighlighted] = useState(false);

  const layoutHandler = (e) => {
    // ctx.initalizeDz(e.nativeEvent.layout, pile.id);
  };

  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };

  return (
      <PileView
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
        onLayout={layoutHandler}
      >
        {
          pile.cards.length ?
          (
            <>
              <Text>{pile.cards[0].rank}</Text>
              <Text>{pile.cards[0].suit}</Text>
              <Text>{pile.cards.length}</Text>
            </>
          )
          :
          null
        }
      </PileView>
  );
};

export default CardPile;

const PileView = styled.View`
  width: 100px;
  height: auto;
  display: flex;
  position: relative;
  z-index: 10;
  padding: 10px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ highlighted }) => (highlighted ? "pink" : "green")};
`


const styles = StyleSheet.create({

  card: {
    position: "relative",
    zIndex: 10,
    flex: 1,
    height: 50,
    width: 50,
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 15,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  highlighted: {
    borderColor: "black",
    borderSize: "5",
    backgroundColor: "pink",
  },
});
