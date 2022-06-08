import React, { useContext, useEffect } from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import Pile from "../classes/Pile"
import CardClass from "../classes/Card"
import PlayerHand from "./PlayerHand";
import CardPile from "./CardPile";
import SandboxContext from "../context/sandboxContext"
import usePan from '../hooks/usePan'
import Movable from './Movable'


const components = {CardPile: {Component: CardPile, CB: {releaseCB: () => {}}}};

export default function Sandbox({ movables }) {
  const ctx = useContext(SandboxContext);

  const piles = Object.values(ctx.piles);

  useEffect(() => {
    //this is a test card
    const newCard = new CardClass("Tests", "Ace");
    let newPile = new Pile();
    newPile = newPile.addCard(newCard);
    ctx.addPile(newPile);

    // Making a 52 card deck
    const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const deck = new Pile;
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        const newCard = new CardClass(suits[i], ranks[j]);
        deck.addCard(newCard);
      }
    }
    ctx.addPile(deck);
  }, []);

  return (
    <View style={styles.container}>
      {movables.map((movable, ind) => {
        console.log("movable", movable)
        const {panState, componentState} = movable;
        panState.id = movable.id;
        const {Component, CB} = components[movable.component];
        return  (
          <Movable key={ind} state={panState} {...CB} >
            <Component  state={componentState} />
          </Movable>)
      })}
      {/* <Button  onPress={() => console.log(ctx.piles)}  title="log state" /> */}
    </View>
    //   <View style={styles.container}>
    //   {piles.map((pile, idx) => {
    //     return
    //     <CardPile pile={pile} key={idx}/>
    //   })}
    //   <PlayerHand text="I am a player hand" />
    //   <StatusBar style="auto" />
    // </View>
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


