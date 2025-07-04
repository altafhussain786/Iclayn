import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import { COLORS } from '../constants';
import Splash from '../screens/splash/Splash';
import BottomTabNavigation from './BottomTabNavigation';
import LoginByPassword from '../screens/auth/login/LoginByPassword';
import ForgetPassword from '../screens/auth/forgetPassword/ForgetPassword';
import Otp from '../screens/auth/otp/Otp';
import Settings from '../screens/settings/Settings';
import MatterDetails from '../screens/tabs/matters/screens/MatterDetails';
import { getToken } from '../helper/Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalenderDetails from '../screens/tabs/calender/screens/CalenderDetails';
import TaskDetails from '../screens/tabs/tasks/screens/TaskDetails';
import Event from '../screens/events/Event';
import TimmerDetails from '../screens/timmerDetails/TimmerDetails';
import CreateMatter from '../screens/tabs/matters/screens/CreateMatter';
import CreateTask from '../screens/tabs/tasks/screens/CreateTask';
import TaskDocuments from '../screens/tabs/tasks/screens/taskDocuments/TaskDocuments';
import TaskFiles from '../screens/tabs/tasks/screens/taskDocuments/TaskFiles';
import Activities from '../screens/tabs/activities/Activities';
import Bills from '../screens/tabs/bills/Bills';
import Clients from '../screens/clients/Clients';



const RootNavigation = () => {
  const Stack = createNativeStackNavigator();
  const tokenFUnction = async () => {
    const token = await getToken();
    return token

  }



  return (
    <>
      {/* <StatusBar hidden /> */}
      <StatusBar hidden backgroundColor={COLORS.PRIMARY_COLOR_LIGHT} barStyle="light-content" />

      <Stack.Navigator

        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right', // 👈 Smooth left-to-right animation
        }}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoginByPassword" component={LoginByPassword} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Activities" component={Activities} />
        <Stack.Screen name="Bills" component={Bills} />
        <Stack.Screen name="Clients" component={Clients} />

        
        {/* //Matters  */}
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="CreateMatter" component={CreateMatter} />
        <Stack.Screen name="TimmerDetails" component={TimmerDetails} />
        <Stack.Screen name="MatterDetails" component={MatterDetails} />
        <Stack.Screen name="CalenderDetails" component={CalenderDetails} />
        <Stack.Screen name="TaskDetails" component={TaskDetails} />
        <Stack.Screen name="CreateTask" component={CreateTask} />
        <Stack.Screen name="TaskDocuments" component={TaskDocuments} />
        <Stack.Screen name="TaskFiles" component={TaskFiles} />





      </Stack.Navigator>
    </>
  );
};


export default RootNavigation;

const styles = StyleSheet.create({});
