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
      deletePileId,
    } = options;
    let updatedComponentState = { ...componentState, [type]: updatedState };
    let updatedMovable = {
      ...movables[id],
      componentState: updatedComponentState,
    };
    let updatedMovables = { ...movables, [id]: updatedMovable };
    if (deletePileId) {
      delete updatedMovables[deletePileId];
    }
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
  getComponents: (movables, dispatch, socket, cardDimensions, userAvatars, users, room) => {
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
                const options = {
                  id: dzId.id,
                  type: "cards",
                  updatedState: updatedCards,
                  componentState: movables[dzId.id].componentState,
                  movables,
                  socket,
                  dispatch: true,
                  deletePileId: movingPileId,
                }
                helpers.updateComponentState(options);

              } else if (dzId && dzId.type === "user") {
                let dzUser = users.filter(user => user.id === dzId.id)[0];
                let updatedUser = JSON.parse(JSON.stringify(dzUser));
                const userIndex = users.indexOf(dzUser);
                const dzPileCards = [...updatedUser.hand.cards];
                const movingCards = [ ...movables[movingPileId].componentState.cards];
                const updatedCards = [...movingCards, ...dzPileCards];
                updatedUser.hand.cards = updatedCards;
                const updatedMovables = {...movables};
                delete updatedMovables[movingPileId];
                const updatedUsers =  [...users];
                updatedUsers[userIndex] = updatedUser;

                const updatedRoom = {...room, Users: updatedUsers, table: updatedMovables};
                delete updatedRoom.socket;

                socket.emit({
                  type: socket.RT.UPDATE_ROOM_STATE,
                  payload: updatedRoom,
                  emitAll: true,
                });
              }
            }
          }
        };
      }
    };
  }
};

export default helpers;
