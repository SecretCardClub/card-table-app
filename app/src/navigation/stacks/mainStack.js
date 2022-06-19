import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from '../../screens/Home'
import Room from '../../screens/Room'
import stackOptions from '../defaultStackOptions'


const Stack = createNativeStackNavigator();


export default function MainStack() {
  return (
    <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ ...stackOptions, gestureEnabled: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}


