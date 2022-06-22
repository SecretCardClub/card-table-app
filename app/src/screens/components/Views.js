import styled, { css } from 'styled-components/native'
import { View, SafeAreaView } from 'react-native'
import { BlurView as BlurViewExpo } from 'expo-blur';
import { SideDrawer } from './SideDrawer'
import { BORDER_RADIUS } from './constants'
import DEVICE from '../../appState/Device'
import { Text, P } from './Text'

let ScreenViewComponent = View;

// if(DEVICE.OS === 'ios') {
//   ScreenViewComponent = SafeAreaView;
// }


export const ScreenView = ({ children, nav, ...screenProps }) => {
  return (
    <ScreenContainer
      {...screenProps}
      onStartShouldSetResponder={(evt) => false}
      onMoveShouldSetResponder={(evt) => false}
      onStartShouldSetResponderCapture={(evt) => false}
      onMoveShouldSetResponderCapture={(evt) => false}
     >
      {children}
       {/* <SideDrawer nav={nav} /> */}
    </ScreenContainer>
  )
}



export const ScreenContainer = styled(ScreenViewComponent)`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  align-items: center;
  flex-direction: column;
  /* justify-content: center; */
  /* width: ${(({ width }) =>  `${width}px` || '100%')}; */
  /* height: ${(({ height }) =>  `${height}px` || '100%')}; */
`



export const BlurView = ({ children, ...screenProps }) => {
  return (
    <BlurViewContainer
      {...screenProps}
      onStartShouldSetResponder={(evt) => false}
      onMoveShouldSetResponder={(evt) => false}
      onStartShouldSetResponderCapture={(evt) => false}
      onMoveShouldSetResponderCapture={(evt) => false}
      intensity={25}
      tint="dark"
     >
      {children}
    </BlurViewContainer>
  )
}


export const Footer = ({ children, ...footerProps }) => {
  return (
    <FooterContainer color={color} >
      {children}
      <BottomSpacer></BottomSpacer>
    </FooterContainer>
  )
}
const BottomSpacer = styled.View`
  height: 2%;
  width: 100%;
  opacity: 0;
`

export const FooterContainer = styled.View`
  height: 2%;
  width: 100%;
`



export const BlurViewContainer = styled(BlurViewExpo)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`



export const UserView = ({ name, color }) => {
  return (
    <UserContainer color={color} >
      <Text color='white' >{name}</Text>
    </UserContainer>
  )
}

const UserContainer = styled.TouchableOpacity`
  width: auto;
  height: auto;
  display: flex;
  padding: 10px;
  color: 'white';
  align-items: center;
  flex-direction: row;
  justify-content: center;
  background-color: ${(({ color }) =>  color || 'grey')};
`

