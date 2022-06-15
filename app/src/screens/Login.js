import React, { useState, useEffect, useContext } from 'react';
import api from '../api/index'
import { P, H1, ScreenView, Button, Input } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import styled from 'styled-components/native'
import { Text } from "react-native";

const SCREEN = `Login screen`
const ERROR_MSG = `${SCREEN} ERROR ->`
let renders = 0;
export default function Login({ navigation }) {
  renders++;
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { User } = state
  const { UT, dev } = User;
  if (dev.state) {
    console.log(`${SCREEN} STATE: `, { User, userName, password })
  }
  if (dev.renders) {
    console.log(`${SCREEN} RENDERS = ${renders}`)
  }


  const nav = (screen) => {
    return () => {
      navigate(screen)
    }
  }


  const login = (e) => {
    api.get.user(userName)
    .then(res => {
      if ( res.name ) {
        setUserName('')
        dispatch({
          type: UT.UPDATE_USER,
          payload : { ...User, ...res  }
        })
        navigate('MainStack')
      }
      else {
        console.log( `${ERROR_MSG} NO USER FOUND`, res)
      }
    })
    .catch(err => console.log(`${ERROR_MSG} login err`,  err))
  }

  return (
      <ScreenView>
        <HeaderView>
          <H1> Hello </H1>
          <P>Please login</P>
        </HeaderView>

        <InputView>
          <Input
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your user name"
          />
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
          />
        </InputView>

        <ButtonView>
          <Button onPress={login} >
            <Text>Login</Text>
          </Button>
          <Button onPress={nav('SignUp')} >
            <Text>Sign up</Text>
          </Button>
          <Button onPress={nav('MainStack')} >
            <Text>Go to main</Text>
          </Button>
        </ButtonView>

      </ScreenView>
  )
}




const InputView = styled.View`
  width: 100%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`




const ButtonView = styled.View`
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`



const HeaderView = styled.View`
  width: 100%;
  height: 25%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
