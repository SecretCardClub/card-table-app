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

const ANIMATION_INTERVAL = 50;

export default function Sandbox({ movables }) {
  const [, dispatch] = useContext(DispatchContext);
  const components = getComponents(movables, dispatch)
  const [animationQueue, setAnimationQueue] = useState({})
  const [animating, setAnimating] = useState(false)

  useEffect(() => {

    const animationArray = [ ...Object.values(animationQueue) ]
    // const animatedTime = Date.now() - animating
    if(animationArray.length && !animating ) {
      // setAnimating(true)
      // console.log('\nNew AnimationQueue')
      Animated.parallel(animationArray.map((config) => {
        // console.log(animationArray)
        // config.duration = config.duration > 100 ? 100 : config.duration
        // console.log(config.duration)
        // config.duration = 25;
        return Animated.timing(config.pan, config)
      })).start(() => {
        // setAnimating(false)
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
    <View style={styles.container}>
      {Object.values(movables).map((movable, ind) => {
        // console.log("movable", movable)
        const { panState, componentState } = movable;
        panState.id = movable.id;
        const { Component, CB } = components[movable.component](movable);
        return  (
          // <Movable key={ind} state={panState} {...CB} >
          <Movable key={ind} state={panState} addAnimation={addAnimation} >
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
    position: 'relative',
  },
});



