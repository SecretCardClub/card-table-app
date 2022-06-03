import React, {useState, useContext} from "react";
import { StyleSheet, Text, View } from "react-native";

import SandboxContext from "../context/sandboxContext"

const PlayerHand = (props) => {
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);


  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
    console.log("ctx.playerHandDropZone: ", ctx.playerHandDropZone)
  }

  return (
    <View
      style={[styles.hand, highlighted && styles.highlighted]}
      onLayout={(e) => {
        ctx.setPlayerHandDropZone(e.nativeEvent.layout);
      }}
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
