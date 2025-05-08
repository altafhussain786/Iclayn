import React, { useEffect, useRef } from 'react';
import {
  View,
  StatusBar,
  Animated,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import LoaderKit from 'react-native-loader-kit';
import { API_URL, BASE_URL, COLORS } from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Looping fade and scale animation for 2 seconds
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoOpacity, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(logoScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(logoScale, {
            toValue: 0.9,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    const timer = setTimeout(async() => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) { navigation.navigate('BottomTabNavigation') }
      else {
        navigation.navigate('Login')
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar hidden />
      <ImageBackground
        blurRadius={2}
        source={require('../../assets/Images/bgimage.png')}
        style={styles.container}
      >
        <Animated.Image
          tintColor={COLORS?.whiteColors}
          source={{ uri: `${BASE_URL}/assets/logo-DuQxixZj.png` }}
          style={[
            styles.logo,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          resizeMode="contain"
        />

        <LoaderKit
          style={styles.loader}
          name="BallScaleMultiple"
          color={COLORS.PRIMARY_COLOR_LIGHT}
        />
      </ImageBackground>
    </>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  loader: {
    width: 80,
    height: 80,
  },
});
