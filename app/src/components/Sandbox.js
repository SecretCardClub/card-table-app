import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Animated, Dimensions, Text } from "react-native";
import { StateContext, DispatchContext } from "../appState/index";
import styled from "styled-components/native";

import PileMenu from "./PileMenu";
import Device from "../appState/Device";
import Movable from "./Movable";
import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers";
import UserAvatar from "./UserAvatar";



let deviceHeight, deviceWidth;
if (Device.OS !== "web") {
  deviceHeight = Device.Dims.height;
  deviceWidth = Device.Dims.width;
} else {
  deviceHeight = window.innerHeight;
  deviceWidth = window.innerWidth;
}

const ANIMATION_INTERVAL = 50;

export default function Sandbox({ movables, socket, users, roomName, roomUser }) {
  const [, dispatch] = useContext(DispatchContext);
  const [animationQueue, setAnimationQueue] = useState({});
  const [animating, setAnimating] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const ctx = useContext(SandboxContext);
  const [components, setComponents] = useState(helpers.getComponents(
    movables,
    dispatch,
    socket,
    ctx.cardDimensions,
    ctx.userAvatarDimensions,
    users,
    roomUser,
  ))

  useEffect(() => {
    setComponents(helpers.getComponents(
      movables,
      dispatch,
      socket,
      ctx.cardDimensions,
      ctx.userAvatarDimensions,
      users,
      roomUser,
    ))
  }, [movables, users, roomUser, ctx])






  useEffect(() => {
    let nextQueue = { ...animationQueue };
    const animationArray = Object.values(nextQueue);
    if (animationArray.length && !animating) {
      Animated.parallel(
        animationArray.map((config) => {
          const nextAnimation = Animated.timing(config.pan, config);
          const nextConfig = nextQueue[config.id];
          if (!nextConfig.duration) {
            delete nextQueue[nextConfig.id];
          } else {
            nextConfig.duration = 0;
          }
          return nextAnimation;
        })
      ).start(() => {
        setAnimationQueue(nextQueue);
      });
    }
  }, [animationQueue]);

  const addAnimation = (newAnimation) => {
    const { id, end } = newAnimation;
    let queued = animationQueue[id];

    if (queued) {
      queued.duration += end - queued.start;
      queued.start = end;
      queued.toValue = newAnimation.toValue;
    } else {
      queued = newAnimation;
      const last = Date.now() - end > 10 ? 10 : Date.now() - end;
      queued.duration = last;
      queued.start = Date.now();
      setAnimationQueue({ ...animationQueue, [id]: queued });
    }
  };

  const userLayoutHandler = (evt) => {
    console.log(evt.nativeEvent.layout);
  };

  return (
    <SandboxContainer>

      {users && users.map((user, ind, allUsers) => {
        const positionPercent = ((ind + 1) / (allUsers.length + 1))
        return <UserAvatar  key={user.id} user={user} position={positionPercent} />
      })}

      {Object.values(movables).map((movable, ind) => {
        const { panState, componentState } = movable;
        panState.id = movable.id;
        const { Component, CB } = components[movable.component](movable);
        return (
          <Movable
            key={ind}
            state={panState}
            addAnimation={addAnimation}
            {...CB}
          >
            <Component
              componentState={componentState}
              movables={movables}
              socket={socket}
            />
          </Movable>
        );
      })}


    </SandboxContainer>
  );
}

const SandboxContainer = styled.View`
  width: 100%;
  flex: 1;
  display: flex;
  /* position: absolute; */
  z-index: 0;
  /* align-items: center; */
  background-color: rgb(255, 255, 255);
`;

const UsersContainer = styled.View`
  /* flex:1; */
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 10%;
  width: 100%;
  width: ${deviceWidth};
`;

const MyView = styled.View`
  width: inherit;
  height: 80%;
  background-color: light blue;
`;
const Header = styled.View`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-evenly;
  background-color: rgb(255, 255, 255);
`;

const UserList = styled.View`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
