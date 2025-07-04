import React from 'react';
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { IconUri } from '../constants';

const FloatingButton = ({

  icon = 'plus',                // Default icon
  onPress,                    // Optional custom onPress
  navigateTo,                 // Optional: name of screen to navigate
  iconColor = '#fff',
  backgroundColor = '#007bff',
  size = 60,
  style = {},                 // Custom style
  iconSize = 28,
  navigation: navProp,        // Optional navigation passed from parent
}) => {
  const navigation = navProp || useNavigation();

  const handlePress = () => {
    console.log("pressed");

    // if (onPress) {
    //   onPress();
    // } else if (navigateTo && navigation?.navigate) {
    //   navigation.navigate(navigateTo);
    // }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fab,
        {
          backgroundColor,

          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Image source={IconUri?.add} style={{
        width: size,
        height: size,
      }} />
      {/* <Feather name={icon} size={iconSize} color={iconColor} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default FloatingButton;
