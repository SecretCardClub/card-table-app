import React, { useState, useEffect, useRef, useContext } from "react";
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

import Pile from "../classes/Pile"
import Card from "../classes/Card"
import PlayerHand from "./PlayerHand";
import CardPile from "./CardPile";

const Sandbox = () => {
  const ctx = useContext(SandboxContext);
  const piles = Object.values(ctx.piles);

  useEffect(() => {
    //this is a test card
    const newCard = new Card("Tests", "Ace");
    let newPile = new Pile();
    newPile = newPile.addCard(newCard);
    ctx.addPile(newPile);

    // Making a 52 card deck
    const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const deck = new Pile;
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        const newCard = new Card(suits[i], ranks[j]);
        deck.addCard(newCard);
      }
    }
    ctx.addPile(deck);
  }, []);

  return (
    <View style={styles.container}>
      {piles.map((pile, idx) => {
        return <CardPile pile={pile} key={idx}/>
      })}
      <PlayerHand text="I am a player hand" />
      <StatusBar style="auto" />
    </View>
  );
}

export default Sandbox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
