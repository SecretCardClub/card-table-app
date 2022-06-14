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

            const w = window.innerWidth;
            const h = window.innerHeight;
            const dropLocation = {
              x: gesture.moveX / w,
              y: gesture.moveY / h,
            };
            let dzId = false;

            Object.values(movables).forEach((movable) => {
              console.log(movable);
              if (movable.id !== movingPileId) {
                const { widthPer, heightPer } = {
                  ...movable.componentState.dz,
                };
                const { x_per, y_per } = { ...movable.panState };
                debugger;
                if (
                  dropLocation.x > x_per - widthPer / 2 &&
                  dropLocation.x < x_per + widthPer / 2 &&
                  dropLocation.y > y_per - heightPer / 2 &&
                  dropLocation.y < y_per + heightPer / 2
                ) {
                  dzId = movable.id;
                }
              }
            });
            if (dzId) {
              const matchedPile = movables[dzId].componentState;
              const updatedPile = matchedPile.concatenateCards(
                movables[movingPileId].cards
              );
              let updatedMovable = { ...movable, componentState: updatedPile };
              let updatedMovables = { ...movables, [pileId]: updatedMovable };
              delete updatedMovables[dzId];
              dispatch({
                type: `UPDATE_TABLE`,
                payload: updatedMovables,
              });
            } else {
              // // const updatedPile = pile.updateDz(currentPan)
              // let updatedMovable = { ...movable, componentState: updatedPile }
              // let updatedMovables = {...movables, [pileId]: updatedMovable};
              // dispatch({
              //   type:`UPDATE_TABLE`,
              //   payload: updatedMovables,
              // })
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
