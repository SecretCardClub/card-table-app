import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from "./authStack";
import MainStack from './mainStack'
import stackOptions from '../defaultStackOptions'


const Stack = createNativeStackNavigator();

export default function AppStack() {

  return (
    <Stack.Navigator
      initialRouteName="AuthStack"
      screenOptions={stackOptions}
    >
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
}


