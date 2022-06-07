import React, { useState, useEffect, useContext } from 'react';
import { StateContext, DispatchContext } from '../appState/index'
import styled from 'styled-components/native'
import { P, H1, ScreenView, Button, Input } from './components/index'

import api from '../api/index'


export default function SignUp({ navigation }) {
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const { user } = state;

  const signUp = (e) => {

    api.post.user({ user_name: userName })
    .then(res => {
      console.log('POST ', { res })
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
    .catch(err => console.log(err))
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