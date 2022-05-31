import React, {useState} from "react";
import { StyleSheet, Text, View } from "react-native";

const PlayerHand = (props) => {
  const [highlighted, setHighlighted] = useState(false);


  const touchStartHandler = () => {
    setHighlighted(true);
  };

  const touchEndHandler = () => {
    setHighlighted(false);
  };

  return (
    <View
      style={[styles.hand, highlighted && styles.highlighted]}
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
    width: "90%",
    height: "20%",
    bottom: 0,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  highlighted: {
    backgroundColor: "yellow",
  },
});
