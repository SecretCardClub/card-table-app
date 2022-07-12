import React, { useContext, useState, useEffect } from "react";
import Sandbox from "../components/Sandbox";
import styled from 'styled-components/native'
import { P, H3, ScreenView, UserView, Button, Input } from './components/index'
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
  const { User, Room, dev } = state
  const { logs } = dev
  const { Users, chat, socket, RT } = Room;


  useEffect(() => {
    if (logs.states.Room || logs.states.all) {
      console.log(`${SCREEN} STATE: `, { Room, User })
    }
    if (logs.renders.Room || logs.renders.all) {
      console.log(`${SCREEN} RENDERS = ${renders}`)
    }
  }, [logs.states.Room, logs.renders.Room, logs.renders.all, logs.states.all, Room])


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
        type: RT.CLIENT_DISCONNECT_SOCKET
      })
    }
    navigate('Home')
  }

  const nav = (screenName) => {
    return (evt) => {
      navigate(screenName)
    }
  }



  const addPile = (e) => {
    const suits = ['H', 'C', 'S', 'D'];
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    const newPile = new Pile({});
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
      dispatch: true,
    })
  }

  return Room.socket ?
  (
    <ScreenView >
      <SandboxContextProvider movables={Room.table}>
        <Sandbox movables={Room.table} socket={socket} users={Users} roomName={Room.name}/>
      </SandboxContextProvider>

      <Header >
        <H3 >{Room.name}</H3>
        <UserList>
          {Users && Users.map(user => <UserView  key={user.id} {...user} />)}
        </UserList>
      </Header>
      <Footer>
        <Button onPress={addPile} title="Add Pile" width='50%' height='100%' />
        <Button onPress={goBack} title="Back" width='50%' height='100%' />
      </Footer>
    </ScreenView>
  )
  :
  (
    <ScreenView >
      <Header>
        <H3>Connecting...</H3>
      </Header>
      <Button onPress={goBack} title="Back" />
  </ScreenView>
  );
};


const ChatList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
`
const Header = styled.View`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  background-color: rgb(230, 230, 230);
`;

const Table = styled.View`
  width: 100%;
  height: 80%;
  display: flex;
  position: relative;
  background-color: rgb(210, 210, 210);
`

const Footer = styled.View`
  width: 100%;
  height: 10%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgb(240, 240, 240);
`

const UserList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
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

