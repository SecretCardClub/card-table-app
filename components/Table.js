import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";

const Table = (props) => {
  const [highlighted, setHighlighted] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {useNativeDriver: false}),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const touchStartHandler = () => {
    setHighlighted(true);
    console.log("table touch start!");
  };

  const touchEndHandler = () => {
    setHighlighted(false);
    console.log("table touch end!");
  };

  return (
    <Animated.View
      style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.table, highlighted && styles.highlighted]}
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
