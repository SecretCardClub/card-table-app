import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dev from '../../screens/Dev'
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
      <Stack.Group >
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="MainStack" component={MainStack} />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
        <Stack.Screen name="Dev" component={Dev} />
      </Stack.Group>

    </Stack.Navigator>
  );
}


