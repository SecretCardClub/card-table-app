import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components/native'
import { P, H1, ScreenView, Button, Input, Text } from './components/index'
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
    const newRoomSocket = socket.create(room.id, { User_id: User.id })
    dispatch({
      type: RT.UPDATE_ROOM_STATE,
      payload : { socket: newRoomSocket }
    })
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


  return (
    <ScreenView>
      <H1> Home </H1>
      <DashBoard>
        <DashView>
          <P>Users</P>
          {Home.Users.map((wssUser, ind) => {
            return <P key={ind} >{wssUser.name}</P>
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


// useEffect(() => {
//   const homeSocket = home.socket;

//   if (user.id) {
//     const newHomeSocket = socket.create('', { User_id: user.id });
//     newHomeSocket.on("connect", () => {
//       dispatch({
//         type: `UPDATE_HOME`,
//         payload : { ...home, socket: newHomeSocket }
//       })
//     });

//     newHomeSocket.on("update_state", (newHomeState) => {
//       const nextHomeState = { ...home, ...newHomeState, socket: newHomeSocket }
//       dispatch({
//         type: `UPDATE_HOME`,
//         payload : nextHomeState
//       })
//     });

//     newHomeSocket.on("connect_error", () => {
//       console.log(`connect_error `)
//       newHomeSocket.connect();
//     });

//     newHomeSocket.on("disconnect", (err) => {
//       console.log(`Home socket disconnected `)
//       // navigate('AuthStack')
//     });
//   }
//   else {
//     if (homeSocket) {
//       homeSocket.close()
//       dispatch({
//         type: `UPDATE_HOME`,
//         payload : { ...home, socket: null }
//       })
//     }
//   }
// }, [user.id])

// newRoomSocket.on("connect", () => {
//   dispatch({
//     type: `UPDATE_ROOM`,
//     payload : { ...state.room, socket: newRoomSocket }
//   })
//   navigate('Room')
// });

// newRoomSocket.on("update_state", (newRoomState) => {
//   const nextRoomState = { ...state.room, ...newRoomState, socket: newRoomSocket }
//   dispatch({
//     type: `UPDATE_ROOM`,
//     payload : nextRoomState
//   })
// });

// newRoomSocket.on("update_table", (newtableState) => {
//   const nextRoomState = { ...state.room, tableState: newtableState, socket: newRoomSocket }
//   dispatch({
//     type: `UPDATE_ROOM`,
//     payload : nextRoomState
//   })
// });

// newRoomSocket.on("update_movable", (newMovableState) => {
//   const nextRoomState = { ...state.room, socket: newRoomSocket }
//   nextRoomState.tableState[newMovableState.id] = newMovableState;
//   dispatch({
//     type: `UPDATE_ROOM`,
//     payload : nextRoomState
//   })
// });

// newRoomSocket.on("connect_error", (err) => {
//   console.log(`connect_error `, err)
//   // roomSocket.connect();
// });

// newRoomSocket.on("close_room", (err) => {
//   console.log(`Room closed `)
//   navigate('Home')
// });

// newRoomSocket.on("disconnect", (err) => {
//   console.log(`Room socket disconnected `)
//   // navigate('Home')
// });