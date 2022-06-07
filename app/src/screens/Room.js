import React, { useContext, useState, useEffect } from "react";
import Sandbox from "../components/Sandbox";
import styled from 'styled-components/native'
import { P, ScreenView, Button, Input } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import { SandboxContextProvider } from "../context/sandboxContext";

export default function Room ({ navigation }) {
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [chatText, setChatText] = useState('')
  const { user, room } = state
  const { users, chat, socket } = room;

  useEffect(() => {
    return () => {
      socket.disconnect()
      console.log(`socket.disconnected = `, socket.disconnected)
      dispatch({
        type:  `UPDATE_ROOM`,
      })
    }
  }, [])

  const sendChat = (e) => {
    const newChat = {
      text: chatText,
      user: user.name,
      user_id: user.id,
      sent_at: Date.now(),
    }
    const oldChat = room.chat || []
    const newRoomState = { ...room, chat: [ ...oldChat, newChat ] }
    delete newRoomState.socket
    socket.emit(`update_state`, newRoomState)
    setChatText('')
  }

  const closeRoom = (e) => {
    socket.emit(`close_room`)
  }

  const addCard = (e) => {
    const newRoomState = { ...room }
    const newTableState = newRoomState.tableState
    const newMovable = {
      x: 0,
      y: 0,
      x_per: 0.5,
      y_per: 0.5,
      id: Object.keys(newTableState).length,
    }
    newTableState[newMovable.id] = newMovable
    dispatch({
      type: `UPDATE_ROOM_EMIT`,
      payload: newRoomState
    })
  }
  const movables = Object.values(room.tableState)
  return (
        // <ScreenView>
        //   <P>Connected users</P>
        //   <UserList>
        //     {users && users.map((connUser, ind) => {
        //       return (
        //         <P key={ind} >  {connUser.name}  </P>
        //       )
        //     })}
        //   </UserList>
        //   <P>Chat</P>
        //   <ChatList>
        //     {chat && chat.map((msg, ind) => {
        //       return (
        //         <P key={ind} >{msg.user}: {msg.text} </P>
        //       )
        //     })}
        //   </ChatList>
        //   <Input
        //     value={chatText}
        //     onChangeText={setChatText}
        //     placeholder="type to chat..."
        //   />
        //   <Button onPress={sendChat} >
        //     <P>Send</P>
        //   </Button>
        //   {room.admin_id === user.id &&
        //   (<Button onPress={closeRoom} >
        //     <P>Close Room</P>
        //   </Button>)}
        // </ScreenView>
      <SandboxContextProvider>
          <Sandbox movables={movables} />
          <Button onPress={addCard} >
            <P>Add Card</P>
          </Button>
          <Button onPress={() => navigate('Home')} >
            <P>Back</P>
          </Button>
      </SandboxContextProvider>
  );
};

const UserList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
`
const ChatList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
`
const Footer = styled.View`
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
`