import React from "react";
import { Dimensions } from "react-native";
import CardPile from "./CardPile";


const SLOP_COEFFICIENT = 1.5;
const helpers = {
  updateComponentState: (options) => {
    const {
      id,
      type,
      updatedState,
      componentState,
      movables,
      socket,
      dispatch,
      returnValue,
    } = options;
    let updatedComponentState = { ...componentState, [type]: updatedState };
    let updatedMovable = {
      ...movables[id],
      componentState: updatedComponentState,
    };
    let updatedMovables = { ...movables, [id]: updatedMovable };
    if (dispatch) {
      socket.emit({
        type: socket.RT.UPDATE_TABLE,
        payload: updatedMovables,
        emitAll: true,
      });
    }
    if (returnValue) {
      return updatedMovables;
    }
  },
  // TODO: currently, needs cardDimensions from sandboxContext to work
  getComponents: (movables, dispatch, socket, cardDimensions, userAvatars) => {
    return {
      CardPile: (movable) => {
        return {
          Component: CardPile,
          CB: {
            releaseCB: (evt, currentPan, position) => {
              evt = evt.nativeEvent;
              const movingPileId = movable.id;
              const { height, width } = Dimensions.get("screen");
              const gestureDropLocation = {
                x: evt.pageX / width,
                y: evt.pageY / height,
              };
              let dzId = false;


              Object.values(userAvatars).forEach((userAvatar) => {
                const { x_per, y_per, avatarWidthPer, avatarHeightPer } =
                  userAvatar;

                if (
                  !dzId &&
                  gestureDropLocation.x > x_per &&
                  gestureDropLocation.x < x_per + avatarWidthPer &&
                  gestureDropLocation.y > y_per &&
                  gestureDropLocation.y < y_per + avatarHeightPer
                ) {
                  dzId = { id: userAvatar.id, type: "user" };
                }
              });
              Object.values(movables).forEach((currentMovable) => {
                if (!dzId && currentMovable.id !== movingPileId) {
                  const { x_per, y_per } = { ...currentMovable.panState };
                  const { cardWidthPer, cardHeightPer } = cardDimensions;

                  if (
                    gestureDropLocation.x >
                      x_per - cardWidthPer / SLOP_COEFFICIENT &&
                    gestureDropLocation.x < x_per &&
                    gestureDropLocation.y >
                      y_per - cardHeightPer / SLOP_COEFFICIENT &&
                    gestureDropLocation.y < y_per
                  ) {
                    dzId = { id: currentMovable.id, type: "movable" };
                  }
                }
              });
              if (dzId && dzId.type === "movable") {

                const dzPileCards = [...movables[dzId.id].componentState.cards];
                const movingCards = [
                  ...movables[movingPileId].componentState.cards,
                ];
                const updatedCards = [...movingCards, ...dzPileCards];
                let updatedComponentState = {
                  ...movables[dzId.id].componentState,
                  cards: updatedCards,
                };
                let updatedMovable = {
                  ...movables[dzId.id],
                  componentState: updatedComponentState,
                };
                let updatedMovables = { ...movables, [dzId.id]: updatedMovable };
                delete updatedMovables[movingPileId];
                socket.emit({
                  type: socket.RT.UPDATE_TABLE,
                  payload: updatedMovables,
                  emitAll: true,
                });
              } else if (dzId && dzId.type === "user") {
                console.log("user drop zone detected: ", dzId);
                console.log("userAvatars: ", userAvatars);
                console.log("selectedUser: ", userAvatars[dzId.id]);

                // const dzPileCards = [...userAvatars[dzId.id].hand.cards];
                // const movingCards = [
                //   ...movables[movingPileId].componentState.cards,
                // ];edCards = [...movingCards, ...dzPileCards];
                // let updatedCom
                // const updatponentState = {
                //   ...userAvatars[dzId.id].componentState,
                //   cards: updatedCards,
                // };
                // let updatedMovable = {
                //   ...movables[dzId.id],
                //   componentState: updatedComponentState,
                // };
                // let updatedMovables = { ...movables, [dzId.id]: updatedMovable };
                // delete updatedMovables[movingPileId];
                // socket.emit({
                //   type: socket.RT.UPDATE_TABLE,
                //   payload: updatedMovables,
                //   emitAll: true,
                // });

              }
            }
          }
        };
      }
    };
  }
};

export default helpers;
