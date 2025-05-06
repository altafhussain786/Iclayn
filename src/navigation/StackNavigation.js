import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </>
  );
};

const Splash = () => {
  return (
    <>
      <Text>Splash </Text>
    </>
  );
};
const Login = () => {
  return (
    <>
      <Text>Login </Text>
    </>
  );
};

export default StackNavigation;

const styles = StyleSheet.create({});
