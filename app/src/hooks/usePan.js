import React, { useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { PanResponder, Animated, Dimensions } from "react-native";
import { StateContext, DispatchContext } from '../appState/index'
const { height, width } = Dimensions.get('window');
const widthDiv = width / 2;
const heightDiv = height / 2;


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


const calcPosition = ({ x, y, x_per, y_per }, pan) => {

  x = width * x_per - widthDiv
  y = height * y_per  - heightDiv


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
  pan.setValue({ x, y })

}


export default function usePan(panState,  moveCB = () => {}, releaseCB = () => {}, grantCB = () => {}) {

  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { User } = state
  const { socket, table, RT } = state.Room;
  const pan = new Animated.ValueXY();

  const position = { ...panState }
  const id = position.id

  const moveEmitter = pan.addListener(({ x, y }) => {
    position.x = x
    position.y = y
  })


  useEffect(() => {
    calcPosition(panState, pan)
  }, [panState.x_per, panState.y_per])


  const emitMove = ({ x, y }, selected = true) => {

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
    })
  }

  const deEmitMove = debounce(emitMove)

  const panCb = useCallback((evt, gesture, selected = true) => {
    deEmitMove(position, selected)
  }, [socket, state.Room.table, panState, position.x, position.y])


  const panResponderMove = Animated.event(
    [
      null,
      { dx: pan.x, dy: pan.y }
    ],
    {
      useNativeDriver: false,
      listener: panCb
    });



  const panResponder = useMemo(() => {
    return PanResponder.create({

      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gesture) => {

        const x = pan.x._value
        const y = pan.y._value;
        pan.setOffset({ x, y });
        grantCB(evt, gesture, pan)
        panCb(evt, gesture)
      },

      onPanResponderMove: (evt, gesture) => {
        panResponderMove(evt, gesture);
        moveCB(evt, gesture, pan)
        panCb(evt, gesture)
      },

      onPanResponderRelease: (evt, gesture) => {
        pan.flattenOffset();
        releaseCB(evt, gesture, pan)
        panCb(evt, gesture, false)
      },

    })
  }, [pan, panState, moveCB, releaseCB, grantCB])

  return [pan, panResponder];
}