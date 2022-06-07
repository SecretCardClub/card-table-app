import api from './api/index';
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { StateContext, DispatchContext } from './appState/index';



function App() {
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const { room, home, user, socket } = state;
  const homeSocket = home.socket;
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  console.log({ state })

  useEffect(() => {
    api.get.user()
    .then(res => {
      console.log('GET ', { res })
      if ( res.name ) {
        setUserName('')
        dispatch({
          type: `UPDATE_USER`,
          payload : { ...user, ...res  }
        })
      }
      else {
        console.log( 'NO USER FOUND', res)
      }
    })
    .catch(err => console.log(err.message))
  }, [])


  useEffect(() => {
    const homeSocket = home.socket;

    if (user.id) {

      const newHomeSocket = socket.create('', { user_id: user.id });
      newHomeSocket.on("connect", () => {
        dispatch({
          type: `UPDATE_HOME`,
          payload : { ...home , socket: newHomeSocket }
        })
      });

      newHomeSocket.on("update_state", (newHomeState) => {
        const nextHomeState = { ...home , ...newHomeState, socket: newHomeSocket }
        dispatch({
          type: `UPDATE_HOME`,
          payload : nextHomeState
        })
      });

      newHomeSocket.on("connect_error", () => {
        console.log(`connect_error `)
        newHomeSocket.connect();
      });
    }
    else {
      if (homeSocket) {
        homeSocket.close()
        dispatch({
          type: `UPDATE_HOME`,
          payload : { ...home, socket: null }
        })
      }
    }

  }, [user.id])



  const changeRoomName = (e) => {
    homeSocket.emit(`update_state`, roomName)
    setRoomName('')
    dispatch({
      type: `UPDATE_ROOM`,
      payload : { ...room, name: roomName }
    })
  }

  const login = (e) => {

    api.get.user(userName)
    .then(res => {
      console.log('GET ', { res })
      if ( res.name ) {
        setUserName('')
        dispatch({
          type: `UPDATE_USER`,
          payload : { ...user, ...res  }
        })
      }
      else {
        console.log( 'NO USER FOUND', res)
      }
    })
    .catch(err => console.log(err.message))
  }

  const logout = (e) => {

    api.put.user({ user_name: userName })
    .then(res => {
      console.log('PUT user ', { res })
      dispatch({
        type: `UPDATE_USER`,
        payload : null
      })
    })
    .catch(err => console.log(err.message))
  }

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
      }
      else {
        console.log( 'NO USER FOUND', res)
      }
    })
    .catch(err => console.log(err.message))
  }


  const newRoom = (e) => {

    api.post.room({ room_name: roomName })
    .then(res => {
      res = res || {}
      console.log('POST ', { res })
      setRoomName('')
      room.name = res.name
      room.socket = socket.create(res.id)
        dispatch({
          type: `UPDATE_ROOM`,
          payload : { ...room, ...res  }
        })
    })
    .catch(err => console.log(err.message))
  }

  return(
  <AppContainer>
    <HomeContainer>
      <UserContainer>
        <div> username: {user.name}</div>
        <input value={userName} onChange={(e) => setUserName(e.target.value)} />
        {user.id ?
          <button onClick={logout} > logout </button>
          :
          <button onClick={login} > login </button>
        }
        <button onClick={signUp} > Sign Up </button>
      </UserContainer>
      <InfoContainer>
        {home.users.map(connUser => {
          return <div key={connUser.id} >{connUser.name}</div>
        })}
        {home.rooms.map(availRoom => {
          return <div key={availRoom.id} >{availRoom.name}</div>
        })}
      </InfoContainer>
    </HomeContainer>
    <RoomContainer>
      <div> room name: {room.name}</div>
      <input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      <button onClick={changeRoomName} > Change room name </button>
      <button onClick={newRoom} > New room </button>

    </RoomContainer>
  </AppContainer>
  )
}



const AppContainer = styled.div`
  width: 100%;
  height: 95%;
  display: flex;
  align-items: center;
  /* flex-direction: column; */
  /* justify-content: space-around; */
  background-color: var(--main-bgc);
`
const HomeContainer = styled.div`
  width: 35%;
  height: 95%;
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  /* justify-content: space-around; */
  background-color: var(--element-bgc);
`
const UserContainer = styled.div`
  width: 100%;
  height: 40%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  justify-content: space-around;
  background-color: var(--element-bgc);
`

const InfoContainer = styled.div`
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  justify-content: space-around;
  background-color: var(--element-bgc);
`

const RoomContainer = styled.div`
  width: 65%;
  height: 95%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  justify-content: space-around;

  background-color: var(--main-bgc);
`

const Footer = styled.footer`
  height: 2em;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bgc-3);
`


export default App;
