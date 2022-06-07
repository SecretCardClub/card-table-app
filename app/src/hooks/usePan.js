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


export default function usePan(panState,  moveCB = () => {}, releaseCB = () => {}, grantCB = () => {}) {
  // const screen = Dimensions.get('screen');

  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { socket, tableState } = state.room;
  const pan = useRef(new Animated.ValueXY()).current;
  // const newRoomState = { ...state.room }
  const socketCB = (newRoomState) => {
    delete newRoomState.socket
    socket.emit(`update_state`, newRoomState)
  }
  const dbEmit = debounce(socketCB, 10)


  const panCb = useCallback((evt, gesture) => {
    const newRoomState = { ...state.room }
    const x_per = (pan.x._value + widthDiv)  / width
    const y_per = (pan.y._value + heightDiv) / height
    const newPanState = { ...panState, x: pan.x._value, y: pan.y._value, x_per, y_per }
    newRoomState.tableState[newPanState.id] = newPanState
    // dbEmit(newRoomState)
    socketCB(newRoomState)
    // delete newRoomState.socket
    // socket.emit(`update_state`, newRoomState)
    // dispatch({
    //   type:`UPDATE_ROOM_EMIT`,
    //   payload: newRoomState,
    // })
  }, [socket, state.room])

  const panResponderMove = Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false, listener: panCb });

  useEffect(() => {
    const { x, y, x_per, y_per } = panState
    // console.log({ x_per, y_per })
    // // console.log({ pan })
    const x_calc = Math.abs(width * x_per) - widthDiv
    const y_calc = Math.abs(height * y_per) - heightDiv
    console.log({ x_calc, y_calc })
    if ( width + 100 > x_calc && height + 100 > y_calc ) {
      pan.setValue({ x: x_calc, y: y_calc })
    }
    else {
      pan.setValue({ x, y, })
    }

  }, [panState.x, panState.y])

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gesture) => {
        // console.log(`GRANT: `, { evt, gesture })
        console.log(`GRANT: `, { x: pan.x._value, y: pan.y._value })

        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        console.log(`GRANT post offset: `, { x: pan.x._value, y: pan.y._value })

        grantCB(evt, gesture, pan)
      },
      onPanResponderMove: (evt, gesture) => {
        // console.log(`MOVE: `, { evt, gesture })
        console.log(`MOVE: `, { x: pan.x, y: pan.y })

        const result = panResponderMove(evt, gesture);
        moveCB(evt, gesture, pan)
        return result;
      },
      onPanResponderRelease: (evt, gesture) => {
        // console.log(`RELEASE: `, { evt, gesture })
        releaseCB(evt, gesture, pan)
        pan.flattenOffset();
        const newRoomState = { ...state.room }
        const x_per = width / pan.x._value
        const y_per = height / pan.y._value
        const newPanState = { ...panState, x: pan.x._value, y: pan.y._value, x_per, y_per }
        newRoomState.tableState[newPanState.id] = newPanState
        dispatch({
          type:`UPDATE_ROOM_EMIT`,
          payload: newRoomState,
        })
      },
    })
  }, [moveCB, releaseCB, grantCB])

  return [pan, panResponder];
}