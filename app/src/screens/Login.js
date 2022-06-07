import React, { useState, useEffect, useContext } from 'react';
import api from '../api/index'
import { P, H1, ScreenView, Button, Input } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import styled from 'styled-components/native'
import { Text } from "react-native";

export default function Login({ navigation }) {
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { user } = state
  console.log({ user })

  const nav = (screen) => {
    return () => {
      navigate(screen)
    }
  }


  const login = (e) => {
    console.log(`Attempting log in for user name `, userName)
    api.get.user(userName)
    .then(res => {
      console.log('GET ', { res })
      if ( res.name ) {
        setUserName('')
        dispatch({
          type: `UPDATE_USER`,
          payload : { ...user, ...res  }
        })
        navigate('MainStack')
      }
      else {
        console.log( 'NO USER FOUND', res)
      }
    })
    .catch(err => console.log('login err',  JSON.stringify(err)))
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
