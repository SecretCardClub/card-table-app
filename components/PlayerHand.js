import React, {useState, useContext} from "react";
import { StyleSheet, Text, View } from "react-native";

import SandboxContext from "../context/sandboxContext"
import helpers from "../helpers/helpers"

const PlayerHand = (props) => {
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const [pile, setPile] = useState(null);


  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
    console.log("ctx.playerHandDropZone: ", ctx.playerHandDropZone)
  }

  const layoutHandler = (e) => {
    const pileObj = helpers.instantiatePile(e.nativeEvent.layout);
    setPile(pileObj);
    ctx.addPile(pileObj);
  }

  return (
    <View
      style={[styles.hand, highlighted && styles.highlighted]}
      onLayout={layoutHandler}
      onTouchStart={touchStartHandler}
      onTouchEnd={touchEndHandler}
    >
      <Text>{props.text}</Text>
    </View>
  );
};

export default PlayerHand;

const styles = StyleSheet.create({
  hand: {
    position: "relative",
    zIndex: 0,
    width: "90%",
    height: "20%",

    alignItems: "center",
    justifyContent: "center",
    bottom: 15,
    borderRadius: 10,
    borderRadiusBottom: 25,
  },
  highlighted: {
    backgroundColor: "yellow",
  },
});
