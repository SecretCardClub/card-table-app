import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";

import SandboxContext from "../context/sandboxContext";
import helpers from "../helpers/helpers"
import usePan from '../hooks/usePan'


const SnappyCard = (props) => {
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);

  const panReleaseCB = useCallback((evt, gesture, pan) => {
      let pileId = helpers.isDropZone(gesture, ctx.piles);
      if (pileId) {
        pan.flattenOffset();
      } else {
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
      }
  }, [ctx.piles])

  const [pan, panResponder] = usePan(undefined, panReleaseCB)



  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };
  console.log(`pan x, y: `, pan.getTranslateTransform())
  return (
    <Animated.View
      style={{
        transform: pan.getTranslateTransform(),
        width: "10%",
        zIndex: 100,
      }}
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
    flex: 1,
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
    backgroundColor: "pink",
  },
});


// const pan = useRef(new Animated.ValueXY()).current;


// let panResponder = useMemo(() => {
//   return PanResponder.create({
//     onStartShouldSetPanResponder: (evt, gestureState) => true,
//     onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
//     onMoveShouldSetPanResponder: (evt, gesture) => true,
//     onPanResponderGrant: () => {
//       pan.setOffset({
//         x: pan.x._value,
//         y: pan.y._value,
//       });
//     },
//     onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
//       useNativeDriver: false,
//     }),
//     onPanResponderRelease: (evt, gesture) => {
//       let pileId = helpers.isDropZone(gesture, ctx.piles);
//       if (pileId) {
//         pan.flattenOffset();
//       } else {
//         Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
//       }
//     },
//   });
// }, [ctx.piles]);