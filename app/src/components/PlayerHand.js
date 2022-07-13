import React, {useState, useContext} from "react";
import { StyleSheet, Text, View } from "react-native";
import styled from 'styled-components/native';

import SandboxContext from "../context/sandboxContext"


const PlayerHand = (props) => {
//   const cards = props.pile.componentState.cards;
// console.log("im props", cards)
  const cards = [
    { rank: '1', suit: 'hearts' },
    { rank: '2', suit: 'hearts' },
    { rank: '3', suit: 'hearts' },
    { rank: '4', suit: 'hearts' },
  ]


  return (
    <CardHandView>
      <Text>Player Hand</Text>
      {cards.map((card) => (
        <Text key={JSON.stringify(card)}>{JSON.stringify(card)}</Text>

      ))}

    </CardHandView>
  );
};

export default PlayerHand;


const CardHandView = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`

// const styles = StyleSheet.create({
//   hand: {
//     position: "absolute",
//     bottom: 15,
//     zIndex: 0,
//     width: "90%",
//     height: "20%",
//     backgroundColor: "blue",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 15,
//     borderRadius: 10,
//     borderRadiusBottom: 25,
//   },
//   highlighted: {
//     backgroundColor: "yellow",
//   },
// });
