import React, { useContext } from "react";
import { Animated } from 'react-native'
import SandboxContext from "../context/sandboxContext"
import Card from "./Card";
import usePan from '../hooks/usePan'


export default function Movable({ state, children }) {
  const ctx = useContext(SandboxContext);
  const [pan, panResponder] = usePan(state)

  return (
      <Animated.View
        style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }], zIndex: 100 }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
  );
}