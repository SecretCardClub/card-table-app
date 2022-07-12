import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import styled from "styled-components/native";

import sandboxContext from "../context/sandboxContext";

const UserAvatar = ({ user }) => {
  const ctx = useContext(sandboxContext);

  const establishUserDimensions = (evt) => {
    if (!ctx.userAvatarDimensions[user.id]) {
      // console.log(user.name, "dimensions: ", evt.nativeEvent.layout);
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
      onLongPress={logUserInfo}
    >
      <Text color="white">{user.name[0]}</Text>
    <CardCount>
      <CountText>{Math.random() > .5 ? 7 : 13}</CountText>
    </CardCount>
    </UserContainer>
  );
};
export default UserAvatar;

const UserContainer = styled.TouchableOpacity`
position: relative;
  margin: 15px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  padding: 10px;
  color: "white";
  /* align-items: center;
  justify-content: center; */
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
