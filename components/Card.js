import React, {useState} from "react";
import { StyleSheet, Text, View } from "react-native";

const Card = (props) => {
  const [highlighted, setHighlighted] = useState(false);

  const touchStartHandler = () => {
    setHighlighted(true);
    console.log("click click!");
  };

  const touchEndHandler = () => {
    setHighlighted(false);
    console.log("clack clack?");
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
    zIndex: 10,
    width: "15%",
    height: "auto",
    padding: 5,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  highlighted: {
    borderColor: "black",
    borderSize: "5",
    backgroundColor: "yellow",
  },
});
