import { StyleSheet, Image, Alert, BackHandler } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Home from '../screens/tabs/home/Home'
import Bills from '../screens/tabs/bills/Bills'
import Calender from '../screens/tabs/calender/Calender'
import Activities from '../screens/tabs/activities/Activities'

// Constants
import { COLORS, IconUri } from '../constants';
import { responsiveHeight as hp } from "react-native-responsive-dimensions";
import Tasks from '../screens/tabs/tasks/Tasks';
import { useFocusEffect } from '@react-navigation/native';
import Matters from '../screens/tabs/matters/Matters';
import More from '../screens/tabs/more/More';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );


  const getTabIcon = (routeName, focused) => {
    switch (routeName) {
      case "Home":
        return IconUri?.Home;
      case "More":
        return IconUri?.more;
      case "Calender":
        return IconUri?.Calender;
      case "Matters":
        return IconUri?.clock;
      case "Tasks":
        return IconUri?.task;
      default:
        return null;
    }
  };

  return (
    <>
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            const iconSource = getTabIcon(route.name, focused);
            return (
              <Image
                source={iconSource}
                style={{
                  width: 25,
                  height: 25,
                  opacity: focused ? 1 : 0.5,
                  // tintColor: focused ? COLORS.PRIMARY_COLOR_LIGHT : '#a1a1a1',
                }}
                resizeMode="contain"
              />
            );
          },
          tabBarActiveTintColor: COLORS.PRIMARY_COLOR_LIGHT,
          tabBarInactiveTintColor: '#a1a1a1',
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Calender" component={Calender} />
        {/* <Tab.Screen name="Activities" component={Activities} /> */}
        <Tab.Screen name="Matters" component={Matters} />
        <Tab.Screen name="Tasks" component={Tasks} />
        <Tab.Screen name="More" component={More} />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.SECONDARY_COLOR,
    height: hp(15),
    borderTopWidth: 0,
    elevation: 5,
  },
});
