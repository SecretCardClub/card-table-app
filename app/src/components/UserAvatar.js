import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import styled from "styled-components/native";

import Device from '../appState/Device'
import sandboxContext from "../context/sandboxContext";

const SCREEN_HEIGHT_POSITION = Math.floor(Device.Dims.height * .03)

const UserAvatar = ({ user, position }) => {
  const ctx = useContext(sandboxContext);
  const SCREEN_WIDTH_POSITION = Math.floor(Device.Dims.width * position)

  const establishUserDimensions = (evt) => {
    if (!ctx.userAvatarDimensions[user.id]) {
      const { width, height } = Dimensions.get("screen");
      const currentAvatarDimensions = {
        avatarWidthPer: evt.nativeEvent.layout.width / width,
        avatarHeightPer: evt.nativeEvent.layout.height / height,
        x_per: evt.nativeEvent.layout.x / width,
        y_per: evt.nativeEvent.layout.y / height,
        id: user.id,
      };
      let avatarDimensions = ctx.userAvatarDimensions;
      avatarDimensions[user.id] = currentAvatarDimensions;
      ctx.setUserAvatarDimensions(avatarDimensions);
    }
  };

  const logUserInfo = () => {
    console.log("user: ", user);
  };

  return (
    <UserContainer
    color={user.color}
    onLayout={establishUserDimensions}
    onPress={logUserInfo}
    top={SCREEN_HEIGHT_POSITION}
    left={SCREEN_WIDTH_POSITION}
    >
    <Text color="white">{user.name}</Text>
    {user.hand && user.hand.cards.length && <Text >{user.hand.cards.length}</Text>}
  </UserContainer>
);
    // <UserContainer
    //   color={user.color}
    //   onLayout={establishUserDimensions}
    //   onLongPress={logUserInfo}
    // >
    //   <Text color="white">{user.name[0]}</Text>
    // <CardCount>
    //   <CountText>{Math.random() > .5 ? 7 : 13}</CountText>
    // </CardCount>
    // </UserContainer>
  //);
};
export default UserAvatar;

// const UserContainer = styled.TouchableOpacity`
// position: relative;
//   margin: 15px;
//   width: 50px;
//   height: 50px;
//   border-radius: 50%;
//   display: flex;
//   padding: 10px;
//   color: "white";
//   background-color: ${({ color }) => color || "grey"};
// `;
const UserContainer = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  display: flex;
  padding: 10px;
  color: "white";
  border-radius: 50%;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  top: ${({ top }) => `${top}px`};
  left: ${({ left }) => `${left}px`};
  background-color: ${({ color }) => color || "grey"};
`;

const CardCount = styled.View`
  position: absolute;
  z-index: 25;
  width: 15px;
  height: 15px;
  padding: 1px;
  object-position: right top;
  color: rgb(69, 65, 65);
  background-color: white;
  border-radius: inherit;
  display: flex;
  `;

const CountText = styled.Text`
width: inherit;
display: flex;
flex-direction: row-reverse;
font-size: 11px;
`;
