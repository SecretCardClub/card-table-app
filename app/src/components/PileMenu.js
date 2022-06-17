import React, { useContext } from "react";
import styled from "styled-components/native";
import { Text, View, Pressable, TouchableOpacity } from "react-native";

import SandboxContext from "../context/sandboxContext";

const PileMenu = ({ setShowMenu, movables, componentState, socket }) => {
  // const ctx = useContext(SandboxContext);

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
    const { id, cards } = componentState;
    let shuffledCards = shuffle(shuffle(shuffle([...cards])));
    let updatedComponentState = { ...componentState, cards: shuffledCards };
    let updatedMovable = {
      ...movables[id],
      componentState: updatedComponentState,
    };
    let updatedMovables = { ...movables, [id]: updatedMovable };
    socket.emit({
      type: socket.RT.UPDATE_TABLE,
      payload: updatedMovables,
      emitAll: true,
    });
    setShowMenu(false);
  };

  const onCloseHandler = () => {
    setShowMenu(false);
  };

  return (
    <MenuContainer>
      <MenuView>
        <Text>Menu Stuff</Text>
        <TouchableOpacity onPress={shufflePileHandler}>
          <Text>Shuffle Cards</Text>
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
