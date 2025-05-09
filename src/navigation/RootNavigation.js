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



const RootNavigation = () => {
  const Stack = createNativeStackNavigator();


  return (
    <>
      <StatusBar hidden />
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
  
 

      </Stack.Navigator>
    </>
  );
};


export default RootNavigation;

const styles = StyleSheet.create({});
