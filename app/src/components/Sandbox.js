import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { StateContext, DispatchContext } from "../appState/index";

import Pile from "../classes/Pile";
import CardClass from "../classes/Card";
import PlayerHand from "./PlayerHand";
import CardPile from "./CardPile";
import SandboxContext from "../context/sandboxContext";
import usePan from "../hooks/usePan";
import Movable from "./Movable";
// import helpers from '../helpers/helpers'

const getComponents = (movables, dispatch) => {
  return {
    CardPile: (movable) => {
      // const pile = movable.componentState

      return {
        Component: CardPile,
        CB: {
          releaseCB: (evt, gesture, currentPan) => {
            const movingPileId = movable.id;
            // const w = window.innerWidth;
            // const h = window.innerWidth;
            const dropLocation = {
              x: gesture.moveX / window.innerWidth,
              y: gesture.moveY / window.innerWidth,
            };
            // console.log(dropLocation);
            let dzId = false;

            Object.values(movables).forEach((movable) => {
              if (movable.id !== movingPileId) {
                const { widthPer, heightPer } = {
                  ...movable.componentState.dz,
                };
                const { x_per, y_per } = { ...movable.panState };
                const dzSlopCoefficient = 1.5;
                if (
                  dropLocation.x > x_per - widthPer / dzSlopCoefficient &&
                  dropLocation.x < x_per + widthPer / dzSlopCoefficient &&
                  dropLocation.y > y_per - heightPer / dzSlopCoefficient &&
                  dropLocation.y < y_per + heightPer / dzSlopCoefficient
                ) {
                  dzId = movable.id;
                }
              }
            });
            if (dzId) {
              console.log("MATCHED DROPLOCATION TO DROPZONE");
              const matchedPileCards = movables[dzId].componentState.cards;
              const addedCards = movables[movingPileId].componentState.cards;
              const updatedCards = [...addedCards, ...matchedPile.cards];
              let updatedComponentState = {
                ...movables[dzId].componentState,
                cards: updatedCards,
              };
              let updatedMovable = {
                ...movable,
                componentState: updatedComponentState,
              };
              let updatedMovables = { ...movables, [pileId]: updatedMovable };
              delete updatedMovables[movingPileId];
              dispatch({
                type: `UPDATE_TABLE`,
                payload: updatedMovables,
              });
            }
          },
        },
      };
    },
  };
};

export default function Sandbox({ movables }) {
  const [, dispatch] = useContext(DispatchContext);
  const components = getComponents(movables, dispatch);
  const [animations, setAnimations] = useState([]);

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
    setAnimations([...animations, newAnimation]);
  };

  return (
    <View style={styles.container}>
      {Object.values(movables).map((movable, ind) => {
        const { panState, componentState } = movable;
        panState.id = movable.id;
        const { Component, CB } = components[movable.component](movable);
        return (
          <Movable
            key={ind}
            state={panState}
            addAnimation={addAnimation}
            {...CB}
          >
            <Component componentState={componentState} movables={movables} />
          </Movable>
        );
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
