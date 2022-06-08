import React, { useState, useEffect, useRef, useContext, useMemo, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, PanResponder, Animated } from "react-native";

import SandboxContext from "../context/sandboxContext";
import helpers from "../helpers/helpers";
import Card from "../classes/Card";
import usePan from "../hooks/usePan";

const CardPile = ({pile}) => {

  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  // const pan = useRef(new Animated.ValueXY()).current;

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

  const layoutHandler = (e) => {
    ctx.initalizeDz(e.nativeEvent.layout, pile.id);
  };

  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };

  return (
      <View
        style={[styles.card, highlighted && styles.highlighted]}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
        onLayout={layoutHandler}
      >
        {/* {
          (pile.cards && pile.cards.length) ?
          (
              <Text>{pile.cards[0].rank}</Text>
              <Text>{pile.cards[0].suit}</Text>
              <Text>{pile.cards.length}</Text>
            ) : (
              null
              )
        } */}
      </View>
  );
};

export default CardPile;

const styles = StyleSheet.create({
  animatedView: {
    width: "10%",
    zIndex: 100,
  },
  card: {
    position: "relative",
    zIndex: 10,
    flex: 1,
    height: 100,
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
