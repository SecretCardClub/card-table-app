import React, { useContext } from "react";
import styled from 'styled-components/native'
import { P, H3, BlurView, UserView, Button, Input } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'


const SCREEN = `Dev screen`
const ERROR_MSG = `${SCREEN} ERROR ->`
let renders = 0;
const RED_BACKGROUND = `rgba(248, 88, 88, .85)`
const GREEN_BACKGROUND = `rgba(5, 238, 36, .85)`
// const TEXT_COLOR = 'rgb(250, 118, 52)'
const TEXT_COLOR = 'white'

export default function Dev ({ navigation }) {

  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { dev } = state
  const { logs } = dev



  const goBack = (evt) => {
    navigation.goBack()
  }

  const updateValue = ( logType, logPointer, currentValue ) => {
    return (evt) => {
      const newDev = dev;
      newDev.logs[logType][logPointer] = !currentValue
      dispatch({
        type: 'UPDATE_DEV',
        payload: newDev,
      })
    }
  }

  const nav = (screenName) => {
    const navState = navigation.getState()
    const { routes } = navState
    const routesIndex = routes.length - 1
    return (evt) => {
      const newRoutes = [ ...routes ]
      newRoutes[routesIndex] = { name: screenName }
      navigation.reset({
        ...navState,
        routes: newRoutes
      })
    }
  }

  const SCREENS = [ 'Home', 'Login', 'Room', 'SignUp', 'Splash' ]
  return (
    <ModalView>
      <Header >
        <H3 color={TEXT_COLOR} >Dev Options</H3>
      </Header>

      <DevOptions>
        <LogValueContainter>
          <P color={TEXT_COLOR} >Navigation</P>
          <NavList >
          {SCREENS.map((screenName, ind) => {
            return (
                <NavButton
                    key={ind}
                    onPress={nav(screenName)}
                    title={screenName}
                    // backgroundColor={buttonColor}
                    // textColor={TEXT_COLOR}
                  />
                  )
                })}
          </NavList>
        </LogValueContainter>

        {Object.entries(logs).map((entry, ind) => {
          const [ key, values ] = entry
          const nonPlural = key.substring(0, key.length - 1)
          return (
            <LogValueContainter key={ ind }>
              <P color={TEXT_COLOR} >{nonPlural} logs</P>
              <LogValueList>
                {Object.entries(values).map((entryB, indB) => {
                  const [ keyB, value ] = entryB
                  const onPress = updateValue(key, keyB, value)
                  const currentState = value || values.all;
                  const nextLogState = currentState ? 'off' : 'on'
                  const buttonText = `Turn ${nextLogState} ${keyB} ${nonPlural} logs.`
                  const buttonColor = currentState ? GREEN_BACKGROUND : RED_BACKGROUND;
                  return (
                    <LogButton
                      key={indB}
                      onPress={onPress}
                      title={buttonText}
                      backgroundColor={buttonColor}
                      textColor={TEXT_COLOR}
                    />
                  )
                })}
              </LogValueList>
            </LogValueContainter>
          )})}
      </DevOptions>

      <Footer>
        <Button
          onPress={goBack}
          title="Back"
          width='50%'
          height='80%'
          textColor='grey'
          backgroundColor='rgba(230, 230, 230, 0.85)'
          margin-top='2px'
          margin-bottom='2px'
        />
      </Footer>
    </ModalView>
  )
};


const ModalView = styled(BlurView)`
  bottom: 0;
  height: 80%;
  position: absolute;
`

const ALPHA = 0.25;

const Header = styled.View`
  width: 100%;
  height: 5%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: rgba(230, 230, 230, ${ALPHA});
`;

const DevOptions = styled.ScrollView`
  width: 100%;
  height: 85%;
  display: flex;
  flex-direction: column;
  background-color: rgba(210, 210, 210, ${ALPHA});
`

const Footer = styled.View`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(240, 240, 240, ${ALPHA});
`


const LogValueContainter = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  padding: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  /* align-items: center; */
  flex-direction: column;
  background-color: rgba(220, 220, 220, ${ALPHA});

`


const LogValueList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  align-items: flex-start;
`
const NavList = styled(LogValueList)`
  flex-direction: row;
  justify-content: space-between;
`

const LogButton = styled(Button)`
  margin-top: 2px;
  margin-bottom: 2px;
`

const NavButton = styled(LogButton)`
  padding-left: 2%;
  padding-right: 2%;
`