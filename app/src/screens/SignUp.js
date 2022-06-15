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
  const { User, SignUp } = state;
  const { dev } = SignUp
  if (dev.state) {
    console.log(`${SCREEN} STATE: `, { SignUp, User, userName, password })
  }
  if (dev.renders) {
    console.log(`${SCREEN} RENDERS = ${renders}`)
  }



  const signUp = (e) => {

    api.post.user({ user_name: userName })
    .then(res => {
      if ( res.name ) {
        setUserName('')
        dispatch({
          type: User.UT.UPDATE_USER,
          payload : { ...User, ...res  }
        })
        navigate('MainStack')
      }
      else {
        console.log(`${ERROR_MSG} NO USER FOUND`, res)
      }
    })
    .catch(err => console.log(`${ERROR_MSG} post error: `, err))
  }

  return (
    <ScreenView>
        <H1> Hello </H1>
        <P>Please enter a user name </P>
        <Input
          value={userName}
          onChangeText={setUserName}
        />
        <Button onPress={signUp} >
          <P>Make new User</P>
        </Button>
    </ScreenView>
  )
}