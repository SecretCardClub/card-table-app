import React, { useContext, useState, useEffect } from "react";
import { Animated, Pressable, View } from 'react-native'
import usePan from '../hooks/usePan'
import styled from 'styled-components/native'
import { Dims } from '../appState/stateValues'



export default function Movable({ state, children, addAnimation }) {
  const [pan, grantCB, moveCB, releaseCB] = usePan(state, addAnimation);
  const [selected, setSelected] = useState(state.selected)
  // const [position, setPosition] = useState(Dims.calcPosition(state))


  useEffect(() => {
    setSelected(state.selected)
  }, [state.selected])

  // useEffect(() => {
  //   setPosition(Dims.calcPosition(state))
  // }, [state.x_per, state.y_per])



  const longPress = (evt) => {
    console.log(`Setting tests to`)
  }

  return (

      <Animated.View
        style={{ transform: pan.getTranslateTransform(), position: 'absolute' }}
        onStartShouldSetResponder={(evt) => true}
        onMoveShouldSetResponder={(evt) => true}
        onResponderMove={moveCB()}
        onResponderGrant={grantCB()}
        onResponderRelease={releaseCB()}
      >
        <Pressable
          onLongPress={longPress}
        >
          <SelectedWrapper color={selected} >
            {children}
          </SelectedWrapper>
        </Pressable>
      </Animated.View>
  );
}


// yarn add react-navigation-stack 
// yarn add @react-native-community/masked-view 
// yarn add react-native-safe-area-context
// const MovableView = styled.View`
//   top: ${(({ top }) => `${top}px`)};
//   left: ${(({ left }) => `${left}px`)};
//   position: absolute;
// `


const SelectedWrapper = styled.View`
  height: auto;
  width: auto;
  padding: 3px;
  background-color:${(({ color }) => color ? color : `rgba(0,0,0,0)` )}
`

/* if(state.id === 72064) {
    pan.addListener((newPosition) => {
      console.log(`MOVABLE ${state.id} is moving`)
    })
  } */

/*
  const TEST_INTERVAL = 50
const TRANS_MULT = 10

const getRandIndex = (length) => {
  return (max = length) => {
    return Math.floor(Math.random() * max)
  }
}

const getRandTransform = (id) => {
  const vals = id.toString()
  const randInd = getRandIndex(vals.length)

  return (panValue = { x: 0, y: 0 }) => {
    const randX = (Number(vals[randInd()]) - Number(vals[randInd()])) * TRANS_MULT
    const randY = (Number(vals[randInd()]) - Number(vals[randInd()])) * TRANS_MULT
    const x = panValue.x + randX
    const y = panValue.y + randY
    return { x, y }
  }
} */