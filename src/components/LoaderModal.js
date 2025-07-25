import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import LoaderKit from 'react-native-loader-kit'
import { COLORS } from '../constants';
const LoaderModal = ({
    visible = false,
    color = COLORS?.PRIMARY_COLOR,
    backgroundOpacity = 0.5,

    textStyle = {},
    loaderName = 'BallSpinFadeLoader',
    loaderStyle = {},
    customLoader = null, // Custom loader component
}) => {
    return (
        <Modal
            statusBarTranslucent
            transparent={true}
            animationType="fade"
            visible={visible}
        >
            <View style={[styles.overlay, { backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})` }]}>
                <View style={[styles.loaderContainer, loaderStyle]}>
                    {customLoader ? customLoader : <LoaderKit
                        style={{ width: 35, height: 35, ...loaderStyle }}
                        name={loaderName} // Optional: see list of animations below
                        color={color} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                    />}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        // backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 4,
        // elevation: 5,
    },
    message: {
        marginTop: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default LoaderModal;
