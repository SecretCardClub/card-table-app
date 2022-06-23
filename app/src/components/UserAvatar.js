import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import styled from "styled-components/native";

import sandboxContext from "../context/sandboxContext";

const UserAvatar = ({ user }) => {
  const ctx = useContext(SandboxContext);

  // console.log("user: ", user);
  const establishUserDimensions = (evt) => {
    if (!ctx.userAvatarDimensions[user.id]) {
      // console.log(user.name, "dimensions: ", evt.nativeEvent.layout);
      const { width, height } = Dimensions.get("screen");
      const currentAvatarDimensions = {
        avatarWidthPer: evt.nativeEvent.layout.width / width,
        avatarHeightPer: evt.nativeEvent.layout.height / height,
      };
      let avatarDimension = ctx.userAvatarDimensions;
      avatarDimensions[user.id] = currentAvatarDimensions;
      ctx.setUserAvatarDimensions(avatarDimensions);
    }
  };

  return (
    <UserContainer color={user.color} onLayout={establishUserDimensions}>
      <Text color="white">{user.name}</Text>
    </UserContainer>
  );
};
export default UserAvatar;

const UserContainer = styled.TouchableOpacity`
  margin: 15px;
  width: auto;
  height: auto;
  display: flex;
  padding: 10px;
  color: "white";
  align-items: center;
  flex-direction: row;
  justify-content: center;
  background-color: ${({ color }) => color || "grey"};
`;
