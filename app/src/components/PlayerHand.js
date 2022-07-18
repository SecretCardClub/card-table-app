import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import styled from 'styled-components/native';

import SandboxContext from "../context/sandboxContext"
import cardIndex from "../assets/cards/cardIndex";
import Pile from "../classes/Pile";

const CARD_LAYOUT = {
  width: 80,
  height: 114,
};

const PlayerHand = ({ player, hand, Room }) => {
const [cards, setCards] = useState([])
const [cardPile, setCardPile] = useState([])
const [highlighted, setHighlighted] = useState(false)
console.log('rawr card', cards)

console.log('room', Room)

useEffect(() => {
  if (hand.cards !== cards) {
    setCards(hand.cards)
  }
}, [hand.cards])

const onPressSelectCard = (card) => {
  return (event) => {
    console.log({card, event})
    card.isSelected = true
    setCardPile([...cardPile, card])
  }
}

const onPressAddSandbox = (event) => {
  const updatedPlayerHand = cards.filter(card => !cardPile.some(selected => selected === card))

  const newPile = new Pile({cards: cardPile})
  const newMovable = {
    component: "CardPile",
    componentState: newPile,
    id: newPile.id,
    panState: {x_per: 0.5, y_per: 0.5}}
  const updatedRoom = {...Room}
  updatedRoom.table[newPile.id] = newMovable;

  updatedRoom.Users = Room.Users.map(user => {
    if (user.name === player) {
      user.hand.cards = updatedPlayerHand;
    }
    return user
  });

  delete updatedRoom.socket;

  Room.socket.emit({
    type: Room.socket.RT.UPDATE_ROOM_STATE,
    payload: updatedRoom,
    emitAll: true,
  });

}


  return (
    <CardHandView horizontal={true}>

      <Text>Player Hand</Text>
      <Pressable onPress={onPressAddSandbox}>
        <Text>
          Add To Sandbox
        </Text>
      </Pressable>
      {cards && cards.map((card, idx) => {
        const key = `${card.suit}${card.rank}`;
         const cardImage = cardIndex[key];
        return (
          <Pressable key={idx} onLongPress={onPressSelectCard(card)}>
            <StyledImage highlighted={card.isSelected} source={cardImage} />
          </Pressable>
        )
      })}
    </CardHandView>
  );
};

export default PlayerHand;


const CardHandView = styled.ScrollView`
  width: 100%;
  flex: .25;
`

const StyledImage = styled.Image`
  width: ${CARD_LAYOUT.width}px;
  height: ${CARD_LAYOUT.height - 2}px;
  z-index: 1000;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${({ highlighted }) =>
  highlighted && "red"};
`;
