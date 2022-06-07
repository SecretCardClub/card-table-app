import React, { useState, useEffect, useMemo, useContext, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";

import SandboxContext from "../context/sandboxContext"
import helpers from "../helpers/helpers"
import SnappyCard from "./SnappyCard"


const Table = (props) => {
  const [highlighted, setHighlighted] = useState(false);
  const [pileId, setPileId] = useState(null)
  const pan = useRef(new Animated.ValueXY()).current;
  const ctx = useContext(SandboxContext);

  const panResponderMove = Animated.event([null, { dx: pan.x, dy: pan.y }], {useNativeDriver: false});

  let panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: function() {
        const result = panResponderMove(...arguments);
        // console.log({result}, arguments)
        return panResponderMove(...arguments);
      },
      onPanResponderRelease: (evt, gesture) => {
        ctx.updatePileDz(pan, pileId)
        pan.flattenOffset();
      },
    })
}, [ctx.piles])


  const layoutChangeHandler = (pan) => {
    console.log(panResponder)
    console.log(pan);

  }

  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };

  const layoutHandler = (e) => {
    const pileObj = helpers.instantiatePile(e.nativeEvent.layout);
    setPileId(pileObj.id);
    ctx.addPile(pileObj);
  }

  return (
    <Animated.View
      style={[{ transform: [{ translateX: pan.x }, { translateY: pan.y }]}, styles.animatedView]}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.table, highlighted && styles.highlighted]}
        onLayout={layoutHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
      >
        <SnappyCard text="Ace Hearts" />
        <Text>{props.text}</Text>
      </View>
    </Animated.View>
  );
};

export default Table;

const styles = StyleSheet.create({
  animatedView: {
    position: "relative",
    width: "40%",
    height: "18%"
  },
  table: {
    position: "relative",
    flex: 1,
    backgroundColor: "red",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  highlighted: {
    borderColor: "black",
    borderSize: "5",
    backgroundColor: "yellow",
  },
});
