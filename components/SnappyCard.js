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

const SnappyCard = (props) => {
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
      onPanResponderRelease: (e, gesture) => {
        Animated.spring(pan, {toValue: {x: 0, y: 0}}).start();
        // pan.flattenOffset();
      },
    })
  ).current;

  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };

  return (
    <Animated.View
      style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }], width: "15%" }}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.card, highlighted && styles.highlighted]}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
      >
        <Text>{props.text}</Text>
      </View>
    </Animated.View>
  );
};

export default SnappyCard;

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    zIndex: 10,
    width: "15%",
    height: "auto",
    padding: 5,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  highlighted: {
    borderColor: "black",
    borderSize: "5",
    backgroundColor: "yellow",
  },
});


