import { useRef, useState, useEffect, useContext } from 'react'
import { NavigationContext } from '@react-navigation/native';

import styled, { css } from 'styled-components/native'
import { Animated } from 'react-native'
import { BORDER_RADIUS } from './constants'
import DEVICE from '../../appState/Device'
import { Button } from './Buttons'


const DRAWER_OPEN_VALUE = -55
const ANIMATION_DUR = 250
export const SideDrawer = ({}) => {

  const navigation = useContext(NavigationContext);
  const { navigate } = navigation
  const [drawerOpen, setDrawerOpen] = useState(false)
  const right = useRef(new Animated.Value(drawerOpen ? DRAWER_OPEN_VALUE : 0)).current;

  const nav = (screenName) => {
    return (evt) => {
      navigate(screenName)
    }
  }

  const toggleDrawer = (evt) => {
    if(!drawerOpen) {
      Animated.timing(right, {
        toValue: DRAWER_OPEN_VALUE,
        duration: ANIMATION_DUR,
        useNativeDriver: false,
      }).start(() => {
        setDrawerOpen(!drawerOpen)
      })

    }
    else {
      Animated.timing(right, {
        toValue: 0,
        duration: ANIMATION_DUR,
        useNativeDriver: false,
      }).start(() => {
        setDrawerOpen(!drawerOpen)
      })
    }
  }

//right={right._value}
  return (
    <Animated.View style={{ transform: [{ translateX: right }], ...animatedStyle }}  >
      <SideDrawerContainer >
        <ToggleDrawerButton title={drawerOpen ? '>' : '<'} onPress={toggleDrawer} />
        <DrawerButtonContainer>
          <DrawerButton title="Dev"  onPress={nav('Dev')}  />
          <DrawerButton title="Dev"  onPress={nav('Dev')}  />
          <DrawerButton title="Dev"  onPress={nav('Dev')}  />
        </DrawerButtonContainer>
      </SideDrawerContainer>
    </Animated.View>
  )
}

const animatedStyle = {
  position: 'absolute',
  top: '5%',
  right: '4%',
}

const DrawerButton = styled(Button)`
  padding: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
`


const ToggleDrawerButton = styled(Button)`
  width: 20%;
  height: 100%;
  padding: 5px;
  background-color: 'grey';
`


const DrawerButtonContainer = styled.View`
  width: 80%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SideDrawerContainer = styled.View`
  top: 5%;
  padding: 5px;
  /* padding-left: 15px; */
  /* right: 0px; */
  display: flex;
  position: absolute;
  align-items: center;
  flex-direction: row;
  background-color: grey;
  justify-content: space-between;
  border-radius: ${BORDER_RADIUS};
`

