import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../../screens/Splash'
import Login from '../../screens/Login'
import SignUp from '../../screens/SignUp'
import stackOptions from '../defaultStackOptions'

const Stack = createNativeStackNavigator();


export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={stackOptions}
      >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}


