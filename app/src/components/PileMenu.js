import React from "react";
import styled from "styled-components/native";
import { Text, View, TouchableOpacity } from "react-native";

import helpers from "./helpers";

const PileMenu = ({ setShowMenu, flipHandler, movables, componentState, socket }) => {
  const { id, cards } = componentState;

  const shuffle = (cards) => {
    let index = cards.length;
    while (index > 0) {
      let randomIndex = Math.floor(Math.random() * index);
      index--;
      [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
    }
    return cards;
  };

  const shufflePileHandler = () => {
    let shuffledCards = shuffle(shuffle(shuffle(shuffle(shuffle([...cards])))));
    const options = {
      id,
      type: "cards",
      updatedState: shuffledCards,
      componentState,
      movables,
      socket,
      dispatch: true,
    };
    helpers.updateComponentState(options);
    setShowMenu(false);
  };

  const deletePileHandler = () => {
    let updatedMovables = { ...movables };
    delete updatedMovables[componentState.id];
    socket.emit({
      type: socket.RT.UPDATE_TABLE,
      payload: updatedMovables,
      emitAll: true,
    });
  };

  const onCloseHandler = () => {
    setShowMenu(false);
  };

  const logHandler = () => {
    console.log("Pile: ", componentState);
  };

  return (
    <MenuContainer>
      <MenuView>
        <TouchableOpacity onPress={logHandler}>
          <Text>Log Pile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deletePileHandler}>
          <Text>Delete Pile</Text>
        </TouchableOpacity>
        {cards.length > 1 && (
          <TouchableOpacity onPress={shufflePileHandler}>
            <Text>Shuffle Cards</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={flipHandler}>
          <Text>Flip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCloseHandler}>
          <Text>Close</Text>
        </TouchableOpacity>
      </MenuView>
    </MenuContainer>
  );
};

export default PileMenu;

const MenuContainer = styled.View`
  /* width: 40%; */
  /* height: 20%; */
  width: 150px;
  height: 140px;
  position: relative;
  z-index: 25;
  border-radius: 5px;
`;

const MenuView = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  padding-left: 25px;
  padding-right: 25px;
  font-weight: 20;
`;

// let updatedComponentState = { ...componentState, cards: shuffledCards };
// let updatedMovable = {
//   ...movables[id],
//   componentState: updatedComponentState,
// };
// // let updatedMovables = { ...movables, [id]: updatedMovable };
// socket.emit({
//   type: socket.RT.UPDATE_MOVABLE,
//   payload: updatedMovable,
//   emitAll: true,
// });
