import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { responsiveWidth as wp, responsiveHeight as hp, responsiveFontSize as fp } from 'react-native-responsive-dimensions';

import LoaderKit from 'react-native-loader-kit'
import { COLORS } from '../constants';


const TouchableButton = ({
    title = 'Button', // Default button text
    onPress = () => { }, // Default empty function
    isLoading = false, // Show loader if true
    disabled = false, // Disable button if true
    style = {}, // Custom styles
    textStyle = {}, // Custom text styles
    loaderColor = '#fff', // Loader color
    backgroundColor =  '#003C83', // Default button color
    textColor = '#fff', // Default text color
    borderRadius = wp(1), // Default border radius
    paddingVertical = hp(1.5), // Default vertical padding
    paddingHorizontal = wp(5), // Default horizontal padding
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor, borderRadius, paddingVertical, paddingHorizontal },
                disabled && styles.disabledButton,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <LoaderKit
                style={{ width: 20, height: 20 }}
                name={'BallSpinFadeLoader'} // Optional: see list of animations below
                color={"white"} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
              />
            ) : (
                <Text style={[styles.text, { color: textColor }, textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default TouchableButton;

const styles = StyleSheet.create({
    button: {
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: wp(4), // Responsive font size
    //    fontFamily:fontFamily.Bold
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});
