import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, PanResponder, Animated } from "react-native";

import SandboxContext from "../context/sandboxContext";
import helpers from "../helpers/helpers";
import Card from "../classes/Card";

const CardPile = ({pile}) => {
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  let panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gesture) => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (evt, gesture) => {
        let dzId = helpers.isDropZone(gesture, ctx.piles, pile.id);
        if (dzId) {
          ctx.concatenateCards(pile.id, dzId)
          // pan.flattenOffset();
        } else {
          ctx.updatePileDz(pan, pile.id);
          pan.flattenOffset();
        }
      },
    });
  }, [ctx.piles]);

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
    <Animated.View
    style={[{transform: [{ translateX: pan.x }, { translateY: pan.y }]}, styles.animatedView]}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.card, highlighted && styles.highlighted]}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
        onLayout={layoutHandler}
      >
        <Text>{pile.cards[0].rank}</Text>
        <Text>{pile.cards[0].suit}</Text>
        <Text>{pile.cards.length}</Text>
      </View>
    </Animated.View>
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
    height: "auto",
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
