import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { StateContext, DispatchContext } from '../appState/index'

import Pile from "../classes/Pile"
import CardClass from "../classes/Card"
import PlayerHand from "./PlayerHand";
import CardPile from "./CardPile";
import SandboxContext from "../context/sandboxContext"
import usePan from '../hooks/usePan'
import Movable from './Movable'
import helpers from '../helpers/helpers'


const getComponents = (movables, dispatch) => {
  return {

    CardPile: (movable) => {
      const pile = movable.componentState

      return {

        Component: CardPile,
        CB: {
          releaseCB: (evt, gesture, currentPan) => {
            const pileId = pile.id
            let dzId = helpers.isDropZone(gesture, movables, pile.id);
            if (dzId) {
              const matchedPile = movables[dzId].componentState
              const updatedPile = matchedPile.concatenateCards(movables[pileId].cards);
              let updatedMovable = { ...movable, componentState: updatedPile }
              let updatedMovables = { ...movables, [pileId]: updatedMovable };
              delete updatedMovables[dzId];
              dispatch({
                type:`UPDATE_TABLE`,
                payload: updatedMovables,
              })

            } else {
              const updatedPile = pile.updateDz(currentPan)
              let updatedMovable = { ...movable, componentState: updatedPile }
              let updatedMovables = {...movables, [pileId]: updatedMovable};
              dispatch({
                type:`UPDATE_TABLE`,
                payload: updatedMovables,
              })
            }
          }
        }
      }
    },


  }
};


export default function Sandbox({ movables }) {
  const [, dispatch] = useContext(DispatchContext);
  const components = getComponents(movables, dispatch)

  return (
    <View style={styles.container}>
      {Object.values(movables).map((movable, ind) => {
        const { panState, componentState } = movable;
        panState.id = movable.id;
        const { Component, CB } = components[movable.component](movable);
        return  (
          <Movable key={ind} state={panState} >
            <Component  state={componentState} />
          </Movable>)
      })}
    </View>
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


  // const ctx = useContext(SandboxContext);

  // const piles = Object.values(ctx.piles);

  // useEffect(() => {
  //   //this is a test card
  //   const newCard = new CardClass("Tests", "Ace");
  //   let newPile = new Pile();
  //   newPile = newPile.addCard(newCard);
  //   ctx.addPile(newPile);

  //   // Making a 52 card deck
  //   const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
  //   const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  //   const deck = new Pile;
  //   for (let i = 0; i < suits.length; i++) {
  //     for (let j = 0; j < ranks.length; j++) {
  //       const newCard = new CardClass(suits[i], ranks[j]);
  //       deck.addCard(newCard);
  //     }
  //   }
  //   ctx.addPile(deck);
  // }, []);

      //   <View style={styles.container}>
    //   {piles.map((pile, idx) => {
    //     return
    //     <CardPile pile={pile} key={idx}/>
    //   })}
    //   <PlayerHand text="I am a player hand" />
    //   <StatusBar style="auto" />
    // </View>