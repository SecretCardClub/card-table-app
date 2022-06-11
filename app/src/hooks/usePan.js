import React, { useMemo, useRef, useContext, useEffect, useCallback } from "react";
import { PanResponder, Animated, Dimensions } from "react-native";
import { StateContext, DispatchContext } from '../appState/index'
const { height, width } = Dimensions.get('window');
const widthDiv = width / 2;
const heightDiv = height / 2;


const debounce = (func, time) => {
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
  // pan.setValue({ x, y })
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
  const { socket, table, RT } = state.Room;
  const pan = useRef(new Animated.ValueXY()).current;
  const position = { ...panState }

  const moveEmitter = pan.addListener(({ x, y }) => {
    position.x = x
    position.y = y
  })


  useEffect(() => {
    calcPosition(panState, pan)
  }, [panState.x, panState.y])


  const emitMove = (currentPan) => {

    const { x, y } = position
    const newPanState = { ...panState, x, y }
    newPanState.x_per = (x + widthDiv)  / width
    newPanState.y_per = (y + heightDiv) / height
    const movable = table[newPanState.id]
    movable.panState = newPanState;
    socket.emit({
      type: RT.UPDATE_MOVABLE,
      payload: movable,
    })
  }

  const deEmitMove = debounce(emitMove, 15)

  const panCb = useCallback((evt, gesture) => {
    // emitMove(pan)
    deEmitMove(pan)
  }, [socket, state.Room.table, panState, pan])


  const panResponderMove = Animated.event([null,
    { dx: pan.x, dy: pan.y }],
    { useNativeDriver: false, listener: panCb }
    );



  const panResponder = useMemo(() => {
    return PanResponder.create({

      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gesture) => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        // emitMove(pan)
        deEmitMove(pan)
        grantCB(evt, gesture, pan)
      },

      onPanResponderMove: (evt, gesture) => {
        const result = panResponderMove(evt, gesture);
        moveCB(evt, gesture, pan)
        return result;
      },

      onPanResponderRelease: (evt, gesture) => {
        pan.flattenOffset();
        releaseCB(evt, gesture, pan)
        const newRoomState = { ...state.Room }
        const x_per = (pan.x._value + widthDiv)  / width
        const y_per = (pan.y._value + heightDiv) / height
        const newPanState = { ...panState, x: pan.x._value, y: pan.y._value, x_per, y_per }
        newRoomState.table[newPanState.id].panState = newPanState;
        socket.emit({
          type: RT.UPDATE_TABLE,
          payload: newRoomState.table,
          emitAll: true,
        })
      },

    })
  }, [moveCB, releaseCB, grantCB])

  return [pan, panResponder];
}