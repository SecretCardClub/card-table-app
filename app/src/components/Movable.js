import React, { useContext, useState, useEffect } from "react";
import { Animated } from 'react-native'
import usePan from '../hooks/usePan'
import styled from 'styled-components/native'


export default function Movable({ state, children, addAnimation, releaseCB }) {
  const [pan, panResponder] = usePan(state, addAnimation, releaseCB);
  const [selected, setSelected] = useState(state.selected)


  useEffect(() => {
    setSelected(state.selected)
  }, [state.selected])

  return (
      <Animated.View
      ref={pan}
      style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }], zIndex: 100 }}
        {...panResponder.panHandlers}
      >
        <SelectedWrapper color={selected} >
          {children}
        </SelectedWrapper>
      </Animated.View>
  );
}

const SelectedWrapper = styled.View`
  height: auto;
  width: auto;
  padding: 3px;
  background-color:${(({ color }) => color ? color : `rgba(0,0,0,0)` )}
`

