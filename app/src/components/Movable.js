import React, { useContext } from "react";
import { Animated } from 'react-native'
import usePan from '../hooks/usePan'


export default function Movable({ state, children, moveCB, releaseCB, grantCB }) {
  const [pan, panResponder] = usePan(state, moveCB, releaseCB, grantCB );

  return (
      <Animated.View
        style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }], zIndex: 100 }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
  );
}