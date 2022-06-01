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

import Card from "./components/Card";
import Table from "./components/Table";
import PlayerHand from "./components/PlayerHand";
import SnappyCard from "./components/SnappyCard";

export default function App() {
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
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        console.log("panRelease!");
        pan.flattenOffset();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Table text="I am a discard pile" />
      <Table text="I am another pile">
        <SnappyCard text="Mr. Snappy Card" />
      </Table>
      <SnappyCard text="Mr. Snappy Card" />
      <Animated.View
        style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }] }}
        {...panResponder.panHandlers}
      >
        <Card text="I'm an ace Baby!" />
      </Animated.View>
      <PlayerHand text="I am a player hand" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
