import React, { useMemo, useRef, useContext, useEffect, useCallback, useState } from "react";
import { PanResponder, Animated, Dimensions } from "react-native";
import { StateContext, DispatchContext } from '../appState/index'
const { height, width } = Dimensions.get('window');

const widthDiv = width / 2;
const heightDiv = height/ 2;




const DEBOUNCE_TIME = 15 // miliseconds

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


const calcPosition = ({ x_per, y_per }) => {



  let x = width * x_per - widthDiv
  let y = height * y_per - heightDiv


  if ( x > widthDiv ) {
    x = widthDiv
  }
  if ( (0 - widthDiv) > x ) {
    x = (0 - widthDiv)
  }

  if ( y > heightDiv ) {
    y = heightDiv
  }
  if ( (0 - heightDiv) > y ) {
    y = (0 - heightDiv)
  }
  return { x, y }
}

let renders = 0;

export default function usePan(panState,  moveCB = () => {}, releaseCB = () => {}, grantCB = () => {}) {
  // renders++
  // console.log(`Pan ${panState.id} has rendered ${renders} times.`)

  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { User } = state
  const { socket, table, RT } = state.Room;
  const pan = useRef(new Animated.ValueXY(calcPosition(panState))).current;
  const position = { ...panState }


  const emitMove = useCallback(({ x, y }, selected = true) => {
    const newPanState = { ...panState, x, y }
    if ( selected ) {
      newPanState.selected = User.color
    }
    newPanState.x_per = (x + widthDiv)  / width
    newPanState.y_per = (y + heightDiv) / height
    const movable = table[newPanState.id]
    movable.panState = newPanState;

    socket.emit({
      type: RT.UPDATE_MOVABLE,
      payload: movable,
      // emitAll: true,
    })

  }, [socket, table, User])


  const panMoveListener = pan.addListener((newPosition) => {
    const {x, y} = newPosition;

    position.x = x + widthDiv;
    position.y = y + heightDiv;

    position.x_per = (x + widthDiv)  / width;
    position.y_per = (y + heightDiv) / height;
  })


  useEffect(() => {

    pan.setValue(calcPosition(panState))

  }, [panState.x_per, panState.y_per])




  // const deEmitMove = debounce(emitMove)

  const panCb = useCallback((evt, gesture, selected = true) => {
    // deEmitMove(position, selected)
    emitMove(position, selected)
  }, [panState, position])


  const panResponderMove = Animated.event(
    [
      null,
      { dx: pan.x, dy: pan.y }
    ],
    {
      useNativeDriver: false,
    });



  const panResponder = useMemo(() => {
    return PanResponder.create({

      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gesture) => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        // grantCB(evt, gesture, pan)
        panCb(evt, gesture)
      },

      onPanResponderMove: (evt, gesture) => {
        panResponderMove(evt, gesture);
        // moveCB(evt, gesture, pan)
      },

      onPanResponderRelease: (evt, gesture) => {
        releaseCB(evt, gesture, pan, position)
        panCb(evt, gesture, false)
        pan.flattenOffset();
      },

    })
  }, [pan, position.x, position.y, moveCB, releaseCB, grantCB])


  return [pan, panResponder];
}
