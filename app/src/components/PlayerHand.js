import React, { useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import styled from 'styled-components/native';

import SandboxContext from "../context/sandboxContext"
import cardIndex from "../assets/cards/cardIndex.js";


const PlayerHand = ({ hand }) => {
const [cards, setCards] = useState(hand.cards || [])
console.log('cards', cards)
const key = `${componentState.cards[0].suit}${componentState.cards[0].rank}`;
const cardImage = cardIndex[key];



// useEffect(() => {
//   if (hand.cards !== cards) {
//     setCards(hand.cards)
//   }
// }, [hand.cards])



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
