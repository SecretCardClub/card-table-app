import React, { useEffect, useContext } from 'react';
import styled from 'styled-components/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { H1, ScreenView } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import api from '../api/index'

export default function Splash({ navigation }) {
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { user } = state

  useEffect(async() => {
    try {
      // await AsyncStorage.setItem('user', '{}')
      const storedUser = await AsyncStorage.getItem('user').then(res => JSON.parse(res))
      const nextUser = { ...user, ...storedUser }
      const apiRes = await api.get.user(null, nextUser.session_id)
      if (apiRes.name) {
        dispatch({
          type: `UPDATE_USER`,
          payload : { ...nextUser, ...apiRes  }
        })
        navigate('MainStack')
      }
      else if (apiRes.id) {
        dispatch({
          type: `UPDATE_USER`,
          payload : { ...nextUser, session_id: apiRes.id  }
        })
        navigate('Login')
      }
      else {
        console.log('NO USER FOUND ', apiRes)
        navigate('Login')
      }
    }
    catch(err) {
      console.log(err.message)
      navigate('Login')
    }

  }, [])

  return (
    <ScreenView>
        <H1> Hello </H1>
    </ScreenView>
  )
}
