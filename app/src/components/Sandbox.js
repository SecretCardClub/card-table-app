import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions } from "react-native";
import { StateContext, DispatchContext } from "../appState/index";
import styled from "styled-components/native";

import Pile from "../classes/Pile";
import PileMenu from "./PileMenu"
import CardClass from "../classes/Card";
import PlayerHand from "./PlayerHand";
import CardPile, { displayMenu } from "./CardPile";
import usePan from "../hooks/usePan";
import Movable from "./Movable";

const getComponents = (movables, dispatch, socket) => {

  const { RT } = socket;

  return {
    CardPile: (movable) => {
      return {
        Component: CardPile,
        CB: {
          releaseCB: (evt, gesture, currentPan, position) => {
            // console.log(movables)
            const movingPileId = movable.id;
            const { height, width } = Dimensions.get('screen')

            const gestureDropLocation = {
              x: gesture.moveX / width,
              y: gesture.moveY / height,
            };

            // console.log("gestureDropLocation: ", gestureDropLocation)
            // console.log("gestrue moveY", gesture.moveY, gesture.moveY / height )
            // console.log("position: ", position.y, position.y_per)
            let dzId = false;

            Object.values(movables).forEach((currentMovable) => {
              // console.log("x_per: ", currentMovable.panState.x_per, "y_per: ", currentMovable.panState.y_per)
              if (!dzId && currentMovable.id !== movingPileId) {
                const { widthPer, heightPer } = {
                  ...currentMovable.componentState.dz,
                };
                const { x_per, y_per } = { ...currentMovable.panState };
                const dzSlopCoefficient = 2;
                if (
                  gestureDropLocation.x > x_per - widthPer / dzSlopCoefficient &&
                  gestureDropLocation.x < x_per + widthPer / dzSlopCoefficient &&
                  gestureDropLocation.y > y_per - heightPer / dzSlopCoefficient &&
                  gestureDropLocation.y < y_per + heightPer / dzSlopCoefficient
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


export default function Sandbox ({ movables, socket }) {
  const [, dispatch] = useContext(DispatchContext);
  const [animations, setAnimations] = useState([]);
  const [showBackground, setShowBackground] = useState(false);

  const components = getComponents(movables, dispatch, socket);

  const addAnimation = (newAnimation) => {
    setAnimations([...animations, newAnimation]);
  };


  return (
    <Container >
      {/* {showBackground && <MenuBackground />} */}
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
            <Component componentState={componentState} movables={movables} socket={socket} />
          </Movable>
        );
      })}
    </Container>
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

const Container = styled.View`
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
`;