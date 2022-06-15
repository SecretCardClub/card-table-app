import React, { useState, useContext } from "react";
import styled from 'styled-components/native'
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, PanResponder, Animated } from "react-native";

import { StateContext, DispatchContext } from '../appState/index'
import helpers from "../helpers/helpers";
import Card from "../classes/Card";
import usePan from "../hooks/usePan";
import CardClass from '../classes/Card'
import Pile from '../classes/Pile'

// MARK LOOK AT ME!!! from Ian lol, just came across this, dont know much about it myself but it sounds useful

//  Since this value is an instance of a class, we will wrap it in a useRef call
//  so that it only gets created once, when the component renders for the first time:
//  const translation = useRef(new Animated.Value(0)).current;
//  LINK: https://eveningkid.medium.com/the-basics-of-react-native-animations-fb00a8ccc178

const CardPile = ({ componentState, movables }) => {
  const [, dispatch] = useContext(DispatchContext);

  const layoutHandler = (e) => {
    const id = componentState.id;
    const layout = (e.nativeEvent.layout);
    const updatedDz = {
      widthPer: layout.width / window.innerWidth,
      heightPer: layout.height / window.innerHeight
    }
    let updatedComponentState = {...componentState, dz: updatedDz};
    let updatedMovable = {...movables[id], componentState: updatedComponentState};
    let updatedMovables = {...movables, [id]: updatedMovable};
    // let updatedMovables = {...movables, movables[id].componentState.dz: updatedDz}
    dispatch({
      type: "UPDATE_TABLE",
      payload: updatedMovables,
    });
  };

  return (
      <PileView
        onLayout={layoutHandler}
      >
        {
          componentState.cards.length ?
          (
            <>
              <Text>{componentState.cards[0].rank}</Text>
              <Text>{componentState.cards[0].suit}</Text>
              <Text>{componentState.cards.length}</Text>
            </>
          )
          :
          null
        }
      </PileView>
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
`


const styles = StyleSheet.create({

  card: {
    position: "relative",
    zIndex: 10,
    flex: 1,
    height: 50,
    width: 50,
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    margin: 15,
    backgroundColor: "grey",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  highlighted: {
    borderColor: "black",
    borderSize: "5",
    backgroundColor: "pink",
  },
});
