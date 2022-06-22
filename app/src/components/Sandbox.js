import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import { StateContext, DispatchContext } from "../appState/index";
import styled from "styled-components/native";

import Pile from "../classes/Pile";
import PileMenu from "./PileMenu"
import CardClass from "../classes/Card";
import PlayerHand from "./PlayerHand";
import CardPile from "./CardPile";
import usePan from "../hooks/usePan";
import Movable from "./Movable";
import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers"

const ANIMATION_INTERVAL = 50;

export default function Sandbox ({ movables, socket }) {
  const [, dispatch] = useContext(DispatchContext);
  const [animationQueue, setAnimationQueue] = useState({})
  const [animating, setAnimating] = useState(false)
  const [showBackground, setShowBackground] = useState(false);
  const ctx = useContext(SandboxContext);
  const components = helpers.getComponents(movables, dispatch, socket);

  useEffect(() => {
    const animationArray = [ ...Object.values(animationQueue) ]
    // const animatedTime = Date.now() - animating
    if(animationArray.length && !animating ) {
      Animated.parallel(animationArray.map((config) => {
        return Animated.timing(config.pan, config)
      })).start(() => {
      })
      setAnimationQueue({})
    }

  }, [animationQueue])

  const addAnimation = (newAnimation) => {
    const { id, timeStamp } = newAnimation
    const queued = animationQueue[id];
    if(queued) {
      queued.duration += timeStamp - queued.timeStamp ;
    }
    else{
      newAnimation.duration = Date.now() - timeStamp
      setAnimationQueue({ ...animationQueue,  [id]: newAnimation})
    }
    // console.log(queued, newAnimation)
  }


  return (
    <Container >
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


const Container = styled.View`
  flex: 1;
  display: flex;
  position: relative;
  /* align-items: center; */
  background-color: rgb(210, 210, 210);
`;


// const getComponents = (movables, dispatch, socket) => {

//   return {
//     CardPile: (movable) => {
//       return {
//         Component: CardPile,
//         CB: {
//           releaseCB: (evt, currentPan, position) => {
//             evt = evt.nativeEvent
//             const movingPileId = movable.id;
//             const { height, width } = Dimensions.get('screen');
//             const gestureDropLocation = {
//               x: evt.pageX / width,
//               y: evt.pageY / height,
//             };
//             let dzId = false;

//             Object.values(movables).forEach((currentMovable) => {
//               if (!dzId && currentMovable.id !== movingPileId) {
//                 const { widthPer, heightPer } = {
//                   ...currentMovable.componentState.dz,
//                 };
//                 const { x_per, y_per } = { ...currentMovable.panState };
//                 const dzSlopCoefficient = 1.8;
//                 if (
//                   gestureDropLocation.x > x_per - widthPer / dzSlopCoefficient &&
//                   gestureDropLocation.x < x_per + widthPer / dzSlopCoefficient &&
//                   gestureDropLocation.y > y_per - heightPer / dzSlopCoefficient &&
//                   gestureDropLocation.y < y_per + heightPer / dzSlopCoefficient
//                 ) {
//                   dzId = currentMovable.id;
//                 }
//               }
//             });
//             if (dzId) {
//               const dzPileCards = [...movables[dzId].componentState.cards];
//               const movingCards = [
//                 ...movables[movingPileId].componentState.cards,
//               ];
//               const updatedCards = [...movingCards, ...dzPileCards];
//               let updatedComponentState = {
//                 ...movables[dzId].componentState,
//                 cards: updatedCards,
//               };
//               let updatedMovable = {
//                 ...movables[dzId],
//                 componentState: updatedComponentState,
//               };
//               let updatedMovables = { ...movables, [dzId]: updatedMovable };
//               delete updatedMovables[movingPileId];
//               socket.emit({
//                 type: RT.UPDATE_TABLE,
//                 payload: updatedMovables,
//                 emitAll: true,
//               });

//             }
//           },
//         },
//       };
//     },
//   };
// };