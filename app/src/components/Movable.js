import React, { useContext, useState, useEffect } from "react";
import { Animated, Pressable, View } from 'react-native'
import usePan from '../hooks/usePan'
import styled from 'styled-components/native'
import { Dims } from '../appState/stateValues'



export default function Movable({ state, children, addAnimation, releaseCB }) {
  const [pan, panGrantCB, panMoveCB, panReleaseCB] = usePan(state, addAnimation);
  const [selected, setSelected] = useState(state.selected)


  useEffect(() => {
    setSelected(state.selected)
  }, [state.selected])


  const longPress = (evt) => {
    console.log(`Setting tests to`)
  }

  return (

      <Animated.View
        style={{ transform: pan.getTranslateTransform(), position: 'absolute' }}
        onStartShouldSetResponder={(evt) => true}
        onMoveShouldSetResponder={(evt) => true}
        onResponderMove={panMoveCB()}
        onResponderGrant={panGrantCB()}
        onResponderRelease={panReleaseCB(releaseCB)}
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
