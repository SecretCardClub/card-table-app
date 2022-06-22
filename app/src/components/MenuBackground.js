import React, { useContext } from "react";
import styled from "styled-components/native";
import { View, TouchableOpacity, Dimensions } from "react-native";

// import SandboxContext from "../context/sandboxContext";

const MenuBackground = ({ setShowMenu, setShowBackground }) => {
  const { width, height } = Dimensions.get("screen");

  const closeBackground = () => {
    setShowMenu(false);
  };
Í
  return (

      <StyledBackground
        // activeOpacity={0.25}
        width={width}
        height={height}
        onPressOut={closeBackground}
      />

  );
};

export default MenuBackground;

const StyledBackground = styled.TouchableOpacity`
position: relative;
z-index: 20;
top: 0;
left: 0;
/* width: 100%;
height: 100%; */
width: ${({ width }) => width};
height: ${({ height }) => height};
background-color: grey;
opacity: .5;
`;
