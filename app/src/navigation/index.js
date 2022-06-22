import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './stacks/appStack'

export default function Navigation() {
  return (
    <NavigationContainer>
      <AppStack/>
    </NavigationContainer>
  );
}
// yarn remove @react-navigation/native-stack  && yarn add @react-navigation/native

