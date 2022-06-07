import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";

import SandboxContext from "../context/sandboxContext"
import Card from "./Card";
import Table from "./Table";
import PlayerHand from "./PlayerHand";
import SnappyCard from "./SnappyCard";
import usePan from '../hooks/usePan'
import Movable from './Movable'


export default function Sandbox({ movables }) {
  const ctx = useContext(SandboxContext);

  return (
    <View style={styles.container}>
      {movables.map((movableState, ind) => {
        return  (
          <Movable key={ind} state={movableState} >
            <Card text="I'm an ace Baby!" />
          </Movable>)
      })}
      {/* <Button  onPress={() => console.log(ctx.piles)}  title="log state" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});


