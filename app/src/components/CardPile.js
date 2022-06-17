import React, { useState, useContext } from "react";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Pressable,
} from "react-native";

// import { StateContext, DispatchContext } from '../appState/index'
import Card from "../classes/Card";
import usePan from "../hooks/usePan";
import CardClass from "../classes/Card";
import Pile from "../classes/Pile";
import PileMenu from "./PileMenu";
import SandboxContext from "../context/sandboxContext";

const CardPile = ({ componentState, movables, socket }) => {
  // const [, dispatch] = useContext(DispatchContext);
  const ctx = useContext(SandboxContext);
  const [highlighted, setHighlighted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const establishViewDimensions = (e) => {
    const id = componentState.id;
    const layout = e.nativeEvent.layout;
    const updatedDz = {
      widthPer: layout.width / window.innerWidth,
      heightPer: layout.height / window.innerHeight,
    };
    let updatedComponentState = { ...componentState, dz: updatedDz };
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
  };
  const onPressInHandler = () => {
    setHighlighted(true);
  };

  const onPressOutHandler = () => {
    setHighlighted(false);
  };

  const onPressHandler = () => {
    console.log(componentState.cards[0]);
    let updatedCards = [...componentState.cards]
    let takenCard = updatedCards.shift();
    console.log({updatedCards})
    console.log(takenCard);
    // update deck with one fewer
    //make new pile with one more
    // keep track of if new pile is unmoved
    //extra clicks are auto delivered to new pile
    // somehow make visual
  };

  const onLongPressHandler = () => {
    ctx.setCurrentPile(componentState);
    setShowMenu(true);
  };

  return (
    <>
      {showMenu ? (
        <PileMenu
          setShowMenu={setShowMenu}
          movables={movables}
          componentState={componentState}
          socket={socket}
        />
      ) : (
        <PileView onLayout={establishViewDimensions} highlighted={highlighted}>
          <Pressable
            onPressIn={onPressInHandler}
            onPressOut={onPressOutHandler}
            onPress={onPressHandler}
            onLongPress={onLongPressHandler}
          >
            {componentState.cards.length ? (
              <>
                <Text>{componentState.cards[0].rank}</Text>
                <Text>{componentState.cards[0].suit}</Text>
                <Text>{componentState.cards.length}</Text>
                {ctx.showPileMenu && <Text>Hello</Text>}
              </>
            ) : null}
          </Pressable>
        </PileView>
      )}
    </>
  );
};

export default CardPile;

const PileView = styled.View`
  width: 100px;
  height: auto;
  display: flex;
  position: relative;
  z-index: 10;
  padding: 10px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ highlighted }) => (highlighted ? "pink" : "grey")};
`;

// const styles = StyleSheet.create({
//   card: {
//     position: "relative",
//     zIndex: 10,
//     flex: 1,
//     height: 50,
//     width: 50,
//     padding: 10,
//     paddingLeft: 25,
//     paddingRight: 25,
//     margin: 15,
//     backgroundColor: "grey",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 5,
//   },
//   highlighted: {
//     borderColor: "black",
//     borderSize: "5",
//     backgroundColor: "pink",
//   },
// });
