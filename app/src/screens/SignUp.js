import React, { useState, useEffect, useContext } from 'react';
import { StateContext, DispatchContext } from '../appState/index'
import { P, H1, ScreenView, Button, Input } from './components/index'
import api from '../api/index'

const SCREEN = `SignUp screen`
const ERROR_MSG = `${SCREEN} ERROR ->`
let renders = 0;

export default function SignUp({ navigation }) {
  renders++
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { User, SignUp, dev } = state;
  const { logs } = dev


  useEffect(() => {
    if (logs.states.SignUp || logs.states.all) {
      console.log(`${SCREEN} STATE: `, { User, SignUp, userName, password })
    }
    if (logs.renders.SignUp || logs.renders.all) {
      console.log(`${SCREEN} RENDERS = ${renders}`)
    }
  }, [logs.states.SignUp, logs.renders.SignUp, logs.renders.all, logs.states.all, User])


  const signUp = (e) => {

    api.post.user({ user_name: userName })
    .then(res => {
      if ( res.name ) {
        setUserName('')
        dispatch({
          type: User.UT.UPDATE_USER,
          payload : { ...User, ...res  }
        })
        navigate('Home')
      }
      else {
        console.log(`${ERROR_MSG} NO USER FOUND`, res)
      }
    })
    .catch(err => console.log(`${ERROR_MSG} post error: `, err))
  }


  const nav = (screenName) => {
    return (e) => {
      navigate(screenName)
    }
  }


  return (
    <ScreenView >
        <H1> Hello </H1>
        <P>Please enter a user name </P>
        <Input
          value={userName}
          onChangeText={setUserName}
        />
        <Button onPress={signUp} title="Make new User" />
    </ScreenView>
  )
}