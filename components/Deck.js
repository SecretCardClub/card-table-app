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
import Card from "../classes/Card"

const Deck = (props) => {
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const [pileId, setPileId] = useState(null);
  const [text, setText] = useState('Card');

  const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
  const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

  useEffect(() => {
    if (ctx.piles[pileId]) {
      setText(`${ctx.piles[pileId].cards[0].rank} ${ctx.piles[pileId].cards[0].suit}`)
    }

  }, [ctx.piles[pileId]])

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
        let pileId = helpers.isDropZone(gesture, ctx.piles);
        if (pileId) {
          ctx.updatePileDz(pan, pileId)
          pan.flattenOffset();
        } else {
          ctx.updatePileDz(pan, pileId)
          pan.flattenOffset();
            // Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
        }
      },
    });
  }, [ctx.piles[pileId]]);

  const layoutHandler = (e) => {
    const pileObj = helpers.instantiatePile(e.nativeEvent.layout);
    setPileId(pileObj.id);
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        const newCard = new Card(suits[i], ranks[j]);
        pileObj.addCard(newCard);
      }
    }

    ctx.addPile(pileObj);
  }

  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
        width: "10%",
        zIndex: 100,
      }}
      {...panResponder.panHandlers}
    >
      <View
        style={[styles.card, highlighted && styles.highlighted]}
        onTouchStart={touchStartHandler}
        onTouchEnd={touchEndHandler}
        onLayout={layoutHandler}
      >
        <Text>{text}</Text>
      </View>
    </Animated.View>
  );
};

export default Deck;

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
