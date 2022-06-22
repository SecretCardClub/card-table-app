import React, { useState, useContext } from "react";
import styled from "styled-components/native";
import {
  StyleSheet,
  Text,
  View,
  PanResponder,
  Animated,
  Pressable,
} from "react-native";

import Card from "../classes/Card";

import SandboxContext from "../context/sandboxContext";
import helpers from "./helpers";

const SpreadPile = () => {

  return (
    <View>

    </View>
  );
};

export default SpreadPile;

const SpreadView = styled.View`
  display: flex,
  flex-direction: row,

`;