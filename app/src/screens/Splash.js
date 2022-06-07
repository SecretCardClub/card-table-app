import React, { useEffect, useContext } from 'react';
import styled from 'styled-components/native'
import { H1, ScreenView } from './components/index'

import { StateContext, DispatchContext } from '../appState/index'
import api from '../api/index'

export default function Splash({ navigation }) {
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { user } = state

  useEffect(() => {
    api.get.user()
    .then(res => {
      if (res.name) {
        dispatch({
          type: `UPDATE_USER`,
          payload : { ...user, ...res  }
        })
        navigate('MainStack')
      }
      else {
        console.log('NO USER FOUND ', res)
        navigate('Login')
      }
    })
    .catch(err => {
      console.log(err.message)
      navigate('Login')
    })
  }, [])

  return (
    <ScreenView>
        <H1> Hello </H1>
    </ScreenView>
  )
}
