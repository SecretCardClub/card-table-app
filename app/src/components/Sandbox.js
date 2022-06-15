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

const getComponents = (movables, dispatch, socket) => {
  const { RT } = socket;
  return {
    CardPile: (movable) => {
      return {
        Component: CardPile,
        CB: {
          releaseCB: (evt, gesture, currentPan) => {
            const movingPileId = movable.id;
            const dropLocation = {
              x: gesture.moveX / window.innerWidth,
              y: gesture.moveY / window.innerWidth,
            };
            let dzId = false;

            Object.values(movables).forEach((currentMovable) => {
              if (!dzId && currentMovable.id !== movingPileId) {
                const { widthPer, heightPer } = {
                  ...currentMovable.componentState.dz,
                };
                const { x_per, y_per } = { ...currentMovable.panState };
                const dzSlopCoefficient = 1.75;
                if (
                  dropLocation.x > x_per - widthPer / dzSlopCoefficient &&
                  dropLocation.x < x_per + widthPer / dzSlopCoefficient &&
                  dropLocation.y > y_per - heightPer / dzSlopCoefficient &&
                  dropLocation.y < y_per + heightPer / dzSlopCoefficient
                ) {
                  dzId = currentMovable.id;
                }
              }
            });
            if (dzId) {
              const dzPileCards = [...movables[dzId].componentState.cards];
              const movingCards = [
                ...movables[movingPileId].componentState.cards,
              ];
              const updatedCards = [...movingCards, ...dzPileCards];
              let updatedComponentState = {
                ...movables[dzId].componentState,
                cards: updatedCards,
              };
              let updatedMovable = {
                ...movables[dzId],
                componentState: updatedComponentState,
              };
              let updatedMovables = { ...movables, [dzId]: updatedMovable };
              delete updatedMovables[movingPileId];
              socket.emit({
                type: RT.UPDATE_TABLE,
                payload: updatedMovables,
                emitAll: true,
              });
            }
          },
        },
      };
    },
  };
};

export default function Sandbox({ movables, socket }) {
  const [, dispatch] = useContext(DispatchContext);
  const components = getComponents(movables, dispatch, socket);
  const [animations, setAnimations] = useState([]);

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
