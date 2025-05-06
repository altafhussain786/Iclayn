import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import { COLORS } from '../constants';
import Splash from '../screens/splash/Splash';
import BottomTabNavigation from './BottomTabNavigation';



const RootNavigation = () => {
  const Stack = createNativeStackNavigator();


  return (
    <>
      <StatusBar hidden />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Splash">
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation} />
  
 

      </Stack.Navigator>
    </>
  );
};


export default RootNavigation;

const styles = StyleSheet.create({});
