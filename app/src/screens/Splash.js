import React, { useEffect, useContext } from 'react';
import styled from 'styled-components/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { H1, ScreenView } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import api from '../api/index'

const SCREEN = `Splash screen`
const ERROR_MSG = `${SCREEN} ERROR ->`
let renders = 0;

export default function Splash({ navigation }) {
  renders++
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [ state ] = useContext(StateContext);
  const { User, Splash, socket } = state;
  const { dev } = Splash
  const { UT } = User
  if (dev.state) {
    console.log(`${SCREEN} STATE: `, { Splash, User, socket })
  }
  if (dev.renders) {
    console.log(`${SCREEN} RENDERS = ${renders}`)
  }

  useEffect(() => {

    const init = async () => {
      // await AsyncStorage.setItem('User', '{}')
        try {
        const storedUser = await AsyncStorage.getItem('User').then(res => JSON.parse(res))
        const nextUser = { ...User, ...storedUser }
        const apiRes = await api.get.user(null, nextUser.session_id)
        if (apiRes.name) {
          const homeSocket = socket.create('', { User_id: apiRes.id })
          dispatch({
            type: UT.UPDATE_USER,
            payload : { ...nextUser, socket: homeSocket, session_id: apiRes.session_id  }
          })
          navigate('MainStack')
          // navigate('Login')
        }
        else {
          console.log(`${SCREEN} init NO User FOUND `, apiRes)
          navigate(`Login`)
        }
      }
      catch(err) {
        console.log(`${SCREEN} init error: `,  err.message)
        navigate(`Login`)
      }
    }
    init()
  }, [])

  return (
    <ScreenView>
        <H1> Hello </H1>
    </ScreenView>
  )
}
