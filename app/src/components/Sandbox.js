import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { StateContext, DispatchContext } from '../appState/index'

import Pile from "../classes/Pile"
import CardClass from "../classes/Card"
import PlayerHand from "./PlayerHand";
import CardPile from "./CardPile";
import SandboxContext from "../context/sandboxContext"
import usePan from '../hooks/usePan'
import Movable from './Movable'
// import helpers from '../helpers/helpers'


const getComponents = (movables, dispatch) => {
  return {

    CardPile: (movable) => {
      // const pile = movable.componentState

      return {

        Component: CardPile,
        CB: {
          releaseCB: (evt, gesture, currentPan) => {
            // console.log("Mark's currentPan:", currentPan)
            // console.log("evt: ", evt);
            // console.log("gesture: ", gesture);
            // console.log("movable: ", movable)
            // let dzId = helpers.isDropZone(gesture, movables, movable.id);

            let dzId = false;

            Object.values(movables).forEach((movable) => {
              console.log(movable);
            })
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
              // // const updatedPile = pile.updateDz(currentPan)
              // let updatedMovable = { ...movable, componentState: updatedPile }
              // let updatedMovables = {...movables, [pileId]: updatedMovable};
              // dispatch({
              //   type:`UPDATE_TABLE`,
              //   payload: updatedMovables,
              // })
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
  const [animations, setAnimations] = useState([])

  // useEffect(() => {

  //   const runAnimations = () => {
  //     return setTimeout(() => {
  //       if(animations.length) {
  //         Animated.parallel(animations).start()
  //         setAnimations([])
  //         return runAnimations()
  //       }
  //     }, 20)
  //   }
  //   const runningAnimations = runAnimations()
  //   return () => {
  //     clearTimeout(runningAnimations)
  //   }
  // }, [ animations ])

  const addAnimation = (newAnimation) => {
    setAnimations([...animations, newAnimation])
  }


  return (
    <View style={styles.container}>
      {Object.values(movables).map((movable, ind) => {
        const { panState, componentState } = movable;
        panState.id = movable.id;
        const { Component, CB } = components[movable.component](movable);
        return  (
          // <Movable key={ind} state={panState} {...CB} >
          <Movable key={ind} state={panState} addAnimation={addAnimation} >
            <Component  state={componentState} movables={movables}/>
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
