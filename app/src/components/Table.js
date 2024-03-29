import React, { useState, useEffect, useMemo, useContext, useCallback } from "react";
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
import usePan from '../hooks/usePan'

const Table = (props) => {

  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const [pileId, setPileId] = useState(Math.random())

  const panReleaseCB = useCallback((evt, gesture, pan) => {
    ctx.updatePileDz(pan, pileId)
  }, [ctx.piles, pileId])
  const [pan, panResponder] = usePan(undefined, panReleaseCB)


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
    pileObj.id = pileId
    // setPileId(pileObj.id);
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


