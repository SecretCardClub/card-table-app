import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import styled from "styled-components/native";



const UserAvatar = ({user}) => {

  console.log(user);
  const establishUserDimensions = (evt) => {
    console.log(user.name, "dimensions: ", evt.nativeEvent.layout);
  };


  return (
    <UserContainer color={user.color} onLayout={establishUserDimensions}>
      <Text color='white' >{user.name}</Text>
    </UserContainer>
  )
};
export default UserAvatar;

const UserContainer = styled.TouchableOpacity`
  margin: 15px;
  width: auto;
  height: auto;
  display: flex;
  padding: 10px;
  color: 'white';
  align-items: center;
  flex-direction: row;
  justify-content: center;
  background-color: ${(({ color }) =>  color || 'grey')};
`