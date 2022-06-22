import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import { StateContext, DispatchContext } from "../appState/index";
import styled from "styled-components/native";

import PileMenu from "./PileMenu"
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
  const components = helpers.getComponents(movables, dispatch, socket, ctx.cardDimensions);

  useEffect(() => {
    const animationArray = [ ...Object.values(animationQueue) ]
    if(animationArray.length && !animating ) {
      Animated.parallel(animationArray.map((config) => {
        return Animated.timing(config.pan, config)
      })).start(() => {
      })
      setAnimationQueue({})
    }

  }, [animationQueue]);


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
