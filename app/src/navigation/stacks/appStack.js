import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dev from '../../screens/Dev'
// import AuthStack from "./authStack";
// import MainStack from './mainStack'

import Home from '../../screens/Home'
import Room from '../../screens/Room'
import Splash from '../../screens/Splash'
import Login from '../../screens/Login'
import SignUp from '../../screens/SignUp'

import stackOptions from '../defaultStackOptions'


const Stack = createNativeStackNavigator();

export default function AppStack() {

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      key="AppStack"
      screenOptions={stackOptions}
    >
      <Stack.Group >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login"  component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Group>

      <Stack.Group >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Room" component={Room} />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
        <Stack.Screen name="Dev" component={Dev} />
      </Stack.Group>

    </Stack.Navigator>
  );
}


{/* <Stack.Group >
  <Stack.Screen name="AuthStack" component={AuthStack} />
  <Stack.Screen name="MainStack" component={MainStack} />
</Stack.Group> */}
