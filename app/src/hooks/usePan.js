import React, { useRef, useContext, useEffect, useCallback, useState } from "react";
import { Animated, Easing, Platform } from "react-native";
import { StateContext } from '../appState/index'

import { Dims } from '../appState/stateValues'

const OS = Platform.OS;
const useNative = OS === 'web' ? false : true;
console.log({ useNative })

const DEBOUNCE_TIME = 20 // miliseconds

const debounce = (func, time = DEBOUNCE_TIME) => {
  let currentFunc = func
  setInterval(() => {
    currentFunc = func
  }, time)
  return function() {
    const res = currentFunc(...arguments)
    currentFunc = () => {}
    return res;
  }
}



let renders = 0;

const ANIMATION_INTERVAL = 50;


export default function usePan(panState, addAnimation) {
  // renders++
  // console.log(`Pan ${panState.id} has rendered ${renders} times.`)

  const [state] = useContext(StateContext);
  const { User } = state
  const { socket, table, RT } = state.Room;
  const pan = useRef(new Animated.ValueXY(Dims.calcPosition(panState))).current;
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {

    const { emitted } = panState
    const timeStamp = emitted ? emitted : 1;
    const animationConfig = {
      toValue: Dims.calcPosition(panState),
      timeStamp,
      useNativeDriver: useNative,
      isInteraction: false,
      easing: Easing.linear,
      id: panState.id,
      pan,
    }

    addAnimation(animationConfig)

  }, [panState.x_per, panState.y_per])





  const emitMove = useCallback(debounce((evt, selected = false) => {
    evt = evt.nativeEvent
    const { x, y } = { x: evt.pageX, y: evt.pageY }
    const newPanState = { ...panState }
    if ( selected ) {
      newPanState.selected = User.color
    }

    newPanState.emitted = Date.now()
    delete newPanState.x
    delete newPanState.y
    newPanState.x_per = x / Dims.width
    newPanState.y_per = y / Dims.height
    const movable = table[newPanState.id]
    movable.panState = newPanState;
    // console.log(newPanState)
    socket.emit({
      type: RT.UPDATE_MOVABLE,
      payload: movable,
      // emitAll: true,
      dispatch: true,
    })
  }), [socket, table, User])


  // const emitMove = useCallback((evt, selected = false) => {
  //   evt = evt.nativeEvent
  //   const { x, y } = { x: evt.pageX, y: evt.pageY }
  //   const newPanState = { ...panState }
  //   if ( selected ) {
  //     newPanState.selected = User.color
  //   }

  //   newPanState.emitted = Date.now()
  //   delete newPanState.x
  //   delete newPanState.y
  //   newPanState.x_per = x / Dims.width
  //   newPanState.y_per = y / Dims.height
  //   const movable = table[newPanState.id]
  //   movable.panState = newPanState;
  //   // console.log(newPanState)
  //   socket.emit({
  //     type: RT.UPDATE_MOVABLE,
  //     payload: movable,
  //     // emitAll: true,
  //     dispatch: true,
  //   })
  // }, [socket, table, User])


  const panCb = useCallback((evt, selected = false) => {
    emitMove(evt, selected)
  }, [panState])

  const grantCB = (CB = () => {}) => {
    return (evt) => {
      evt.nativeEvent.start = Date.now()
      panCb(evt, true)
      CB(evt)
    }
  }

  const moveCB = (CB = () => {}) => {
    return (evt) => {
      evt.nativeEvent.now = Date.now()
      panCb(evt, true)
      CB(evt)
    }
  }

  const releaseCB = (CB = () => {}) => {
    return (evt) => {
      // evt.nativeEvent.end = Date.now()
      pan.flattenOffset();
      panCb(evt)
      CB(evt)
    }
  }


  return [pan, grantCB, moveCB, releaseCB];
}






  // const [animating, setAnimating] = useState(false)
  // const [position, setPosition] = useState()
  // const panData = { ...panState  }
  // pan.addListener((currentPan) => {
  //   panData.x = currentPan.x
  //   panData.y = currentPan.y
  // })


  // useEffect(() => {


  //   const animation = Animated.timing(pan, {
  //     toValue: Dims.calcPosition(panState),
  //     duration,
  //     useNativeDriver: true,
  //     isInteraction: false,
  //     easing: Easing.linear
  //   }).start(() => {
  //     setAnimating(false)
  //   })
  //   addAnimation(animation)

  //   // const newPosition = Dims.calcPosition(panState)
  //   // const { start, now, end } = panState;
  //   // let duration;

  //   // // const duration = panState.emitted ? Date.now() - panState.emitted: 5;

  //   // if(!animating) {
  //   //   setAnimating(true)
  //   //   Animated.timing(pan, {
  //   //     toValue: newPosition,
  //   //     duration,
  //   //     useNativeDriver: true,
  //   //     isInteraction: false,
  //   //     easing: Easing.linear
  //   //   }).start(() => {
  //   //     setAnimating(false)
  //   //   })
  //   // }
  //   // else {
  //   //   setTimeout(() => {
  //   //     setPosition(newPosition)
  //   //   }, duration)
  //   // }
  // }, [position])
  // const emitMove = useCallback(
  //   debounce((evt, selected = false) => {
  //     evt = evt.nativeEvent
  //     const { x, y } = { x: evt.pageX, y: evt.pageY }
  //     const newPanState = { ...panState }
  //     if ( selected ) {
  //       newPanState.selected = User.color
  //     }
      // const { start, now, end } = evt;
      // if(start) {
      //   newPanState.start = start
      // }
      // if(now) {
      //   newPanState.now = now
      // }
      // if(end) {
      //   newPanState.end = end
      // }

  //     delete newPanState.x
  //     delete newPanState.y
  //     newPanState.x_per = x / Dims.width
  //     newPanState.y_per = y / Dims.height
  //     const movable = table[newPanState.id]
  //     movable.panState = newPanState;
  //     // console.log('EMITTING movable state ', newPanState)
  //     socket.emit({
  //       type: RT.UPDATE_MOVABLE,
  //       payload: movable,
  //       // emitAll: true,
  //       dispatch: true,
  //     })
  //   }), [socket, table, User])
