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

const Table = (props) => {
  const [highlighted, setHighlighted] = useState(false);
  const [pile, setPile] = useState({})
  const pan = useRef(new Animated.ValueXY()).current;
  const ctx = useContext(SandboxContext);

  let panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {useNativeDriver: false}),
      onPanResponderRelease: () => {
        layoutChangeHandler(pan);
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
    console.log("table touch start!");
  };

  const touchEndHandler = () => {
    setHighlighted(false);
    console.log("table touch end!");
  };

  const layoutHandler = (e) => {
    const pileObj = helpers.instantiatePile(e.nativeEvent.layout);
    setPile(pileObj);
    ctx.addPile(pileObj);
  }

  return (
    <Animated.View
      style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.table, highlighted && styles.highlighted]}
        onLayout={layoutHandler}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
      >
        <Text>{props.text}</Text>
      </View>
    </Animated.View>
  );
};

export default Table;

const styles = StyleSheet.create({
  table: {
    position: "relative",
    width: "90%",
    height: "40%",
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
