import React from "react"
import {Dimensions} from 'react-native';
import CardPile from "./CardPile";

const helpers = {

  updateComponentState: (options) => {
    const {id, type, updatedState, componentState, movables, socket, dispatch, returnValue} = options;
    let updatedComponentState = {...componentState, [type]: updatedState}
    let updatedMovable = {...movables[id], componentState: updatedComponentState};
    let updatedMovables = {...movables, [id]: updatedMovable};
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
  getComponents: (movables, dispatch, socket) => {

    return {
      CardPile: (movable) => {
        return {
          Component: CardPile,
          CB: {
            releaseCB: (evt, currentPan, position) => {
              evt = evt.nativeEvent
              const movingPileId = movable.id;
              const { height, width } = Dimensions.get('screen');
              const gestureDropLocation = {
                x: evt.pageX / width,
                y: evt.pageY / height,
              };
              let dzId = false;

              Object.values(movables).forEach((currentMovable) => {
                if (!dzId && currentMovable.id !== movingPileId) {
                  const { widthPer, heightPer } = {
                    ...currentMovable.componentState.dz,
                  };
                  const { x_per, y_per } = { ...currentMovable.panState };
                  const dzSlopCoefficient = 1.8;
                  if (
                    gestureDropLocation.x > x_per - widthPer / dzSlopCoefficient &&
                    gestureDropLocation.x < x_per + widthPer / dzSlopCoefficient &&
                    gestureDropLocation.y > y_per - heightPer / dzSlopCoefficient &&
                    gestureDropLocation.y < y_per + heightPer / dzSlopCoefficient
                  ) {
                    dzId = currentMovable.id;
                  }
                }
              });
              if (dzId) {
                const dzPileCards = [...movables[dzId].componentState.cards];
                const movingCards = [
                  ...movables[movingPileId].componentState.cards,
                ];
                const updatedCards = [...movingCards, ...dzPileCards];
                let updatedComponentState = {
                  ...movables[dzId].componentState,
                  cards: updatedCards,
                };
                let updatedMovable = {
                  ...movables[dzId],
                  componentState: updatedComponentState,
                };
                let updatedMovables = { ...movables, [dzId]: updatedMovable };
                delete updatedMovables[movingPileId];
                socket.emit({
                  type: socket.RT.UPDATE_TABLE,
                  payload: updatedMovables,
                  emitAll: true,
                });

              }
            },
          },
        };
      },
    };
  }
};

export default helpers;