import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components/native'
import { P, H1, ScreenView, Button, Input, Text, UserView } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import api from '../api/index'

const SCREEN = `Home screen`
const ERROR_MSG = `${SCREEN} ERROR ->`
let renders = 0;

export default function Home({ navigation }) {
  renders++
  const { navigate } = navigation;
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [newRoomname, setNewRoomname] = useState('')
  const { User, Home, Room, socket } = state
  const { HT, dev } = Home
  const { RT } = Room
  if (dev.state) {
    console.log(`${SCREEN} STATE: `, { Home, User, newRoomname })
  }
  if (dev.renders) {
    console.log(`${SCREEN} RENDERS = ${renders}`)
  }


  const nav = (screenName) => {
    return (e) => {
      navigate(screenName)
    }
  }

  const openRoom = (room) => {
    socket.create(room.id, { User_id: User.id }, 'Room')
    navigate('Room')
  }


  const createRoom = () => {

    api.post.room({ room_name: newRoomname, User_id: User.id })
    .then(res => {
      console.log('POST ', { res })
      if (res) {
        setNewRoomname('')
        openRoom(res)
      }
    }).catch(err => console.log(err.message))
  }

  const testConnection = () => {
    socket.create(newRoomname, { User_id: User.id }, 'Room')
    // navigate('Room')
  }


  return (
    <ScreenView>
      <H1> Home </H1>
      <DashBoard>
        <DashView>
          <P>Users</P>
          {Home.Users.map((wssUser, ind) => {
            return <UserView key={ind} {...wssUser} />
          })}
        </DashView>
        <DashView>
        <P>Rooms</P>
          {Home.Rooms.map((room, ind) => {
            return (
              <Button onPress={(e) => openRoom(room)}  key={ind} >
                <P>{room.name}</P>
              </Button>
            )
          })}
        </DashView>
      </DashBoard>
      <Input value={newRoomname} onChangeText={setNewRoomname} />
      <Button onPress={createRoom} >
        <Text>Create room</Text>
      </Button>
      <Button onPress={testConnection} >
        <Text>Test Url</Text>
      </Button>
    </ScreenView>
  )
}

const DashBoard = styled.View`
  width: 100%;
  height: 50%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;
`

const DashView = styled.View`
  width: 50%;
  height: 50%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
`
