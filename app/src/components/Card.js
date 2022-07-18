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
import usePan from '../hooks/usePan'



const Card = (props) => {

  const [highlighted, setHighlighted] = useState(false);
  // const [pan, panResponder] = usePan()


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
    >
      <Text>{props.text}</Text>
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    zIndex: 100,
    flex: 1,
    height: "auto",
    padding: 5,
    backgroundColor: "blue",
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


// const pan = useRef(new Animated.ValueXY()).current;

// const panResponder = useRef(
//   PanResponder.create({
//     onMoveShouldSetPanResponder: () => true,
//     onPanResponderGrant: () => {
//       pan.setOffset({
//         x: pan.x._value,
//         y: pan.y._value,
//       });
//     },
//     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {useNativeDriver: false}),
//     onPanResponderRelease: () => {
//       pan.flattenOffset();
//     },
//   })
// ).current;