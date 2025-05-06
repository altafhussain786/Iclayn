import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constants';
import LoaderKit from 'react-native-loader-kit'
import LogoText from '../../components/LogoText';


const Splash = ({ navigation }) => {
    setTimeout(() => {
        navigation.navigate('Login');
    }, 3000);
      console.log(COLORS?.whiteColors ?? 'missing color');
    
    return (
        <>
            <StatusBar hidden />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "white" }}>
                <LoaderKit
                    style={{ width: 150, height: 150 }}
                    name={'BallScaleMultiple'} // Optional: see list of animations below
                    color={COLORS?.PRIMARY_COLOR} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                />
               
            </View>
        </>
    );
};


export default Splash

const styles = StyleSheet.create({})