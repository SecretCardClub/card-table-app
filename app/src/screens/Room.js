import React, { useContext, useState, useEffect } from "react";
import Sandbox from "../components/Sandbox";
import styled from 'styled-components/native'
import { P, H2, ScreenView, UserView, Button, Input } from './components/index'
import { StateContext, DispatchContext } from '../appState/index'
import { SandboxContextProvider } from "../context/sandboxContext";
import Pile from '../classes/Pile'
import Card from "../classes/Card"

const SCREEN = `Room screen`
const ERROR_MSG = `${SCREEN} ERROR ->`
let renders = 0;

export default function Room ({ navigation }) {
  renders++;
  const { navigate } = navigation
  const [, dispatch] = useContext(DispatchContext);
  const [state] = useContext(StateContext);
  const [chatText, setChatText] = useState('')
  const { User, Room } = state
  const { Users, chat, socket, RT, dev } = Room;
  if (dev.state) {
    console.log(`${SCREEN} STATE: `, { Room, User })
  }
  if (dev.renders) {
    console.log(`${SCREEN} RENDERS = ${renders}`)
  }



  const sendChat = (e) => {
    const newChat = {
      text: chatText,
      User: User.name,
      User_id: User.id,
      sent_at: Date.now(),
    }
    socket.emit({
      type: RT.ADD_CHAT,
      payload: newChat,
      emitAll: true,
    })
    setChatText('')
  }

  const goBack = (e) => {
    if(socket) {
      socket.emit({
        type: "DISCONNECT_SOCKET"
      })
    }
    navigate('Home')
  }



  const addPile = (e) => {
    const suits = ['Hearts', 'Clubs', 'Spades', 'Diamonds'];
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const newPile = new Pile();
    for (let i = 0; i < suits.length; i++) {
      for (let j = 0; j < ranks.length; j++) {
        const newCard = new Card(suits[i], ranks[j]);
        newPile.addCard(newCard);
      }
    }
    const newMovable = {
      id: newPile.id,
      component: "CardPile",
      panState: {
        x: 0,
        y: 0,
        x_per: 0.5,
        y_per: 0.5,
      },
      componentState: newPile,
    }
    socket.emit && socket.emit({
      type: RT.UPDATE_MOVABLE,
      payload: newMovable,
      emitAll: true,
    })
  }

  return Room.socket ?
  (
    <SandboxContextProvider>
      <Header>
        <H2>{Room.name}</H2>
      </Header>
      <UserList>
        {Users && Users.map(user => <UserView  key={user.id} {...user} />)}
      </UserList>
      <Sandbox movables={Room.table} />
      <Button onPress={addPile} >
        <P>Add Pile</P>
      </Button>
      <Button onPress={goBack} >
        <P>Back</P>
      </Button>
    </SandboxContextProvider>
  )
  :
  (
    <SandboxContextProvider>
      <Header>
        <H2>Connecting...</H2>
      </Header>
      <Button onPress={goBack} >
          <P>Back</P>
      </Button>
  </SandboxContextProvider>
  );
};


const ChatList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
`
const Header = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const UserList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
`


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