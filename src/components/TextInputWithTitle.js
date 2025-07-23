

import React, { useState } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import MyText from './MyText';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library you're using
import { calculatefontSize } from '../helper/responsiveHelper';
import AntDesign from 'react-native-vector-icons/AntDesign';

const TextInputWithTitle = ({
    value,
    setFieldValue,
    keyboardType = 'default',
    editable = true,
    onChangeText,
    placeholder,
    extraStyle = {},
    extraInputStyle = {},
    title = 'Event title',
    iconName, // e.g., 'email', 'lock', 'person'
    onIconPress, // optional action on icon press
    secureTextEntry = false,
    isRequired = false,
    arrayValue = [],
    isButton = false,
    onPressButton = () => { },
    buttonText = 'Invite attendees',
    customView,
    ...rest
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const showSecureToggle = secureTextEntry;
    return (
        <View style={[styles.wrapper, extraStyle]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                <MyText style={styles.label}>{title} {isRequired && <MyText style={{ color: 'red' }}>*</MyText>}
                </MyText>

            </View>
            <View style={[styles.container, !editable && styles.disabledContainer]}>
                {isButton ?
                    customView ? (
                        customView({ arrayValue, setFieldValue, onPressButton, buttonText })

                    )

                        :
                        <TouchableOpacity onPress={onPressButton} style={{ paddingVertical: 10 }}>
                            <MyText style={styles.btnTextStyle}>{buttonText}</MyText>
                        </TouchableOpacity>

                    : <TextInput
                        keyboardType={keyboardType}
                        editable={editable}
                        placeholderTextColor={COLORS.LIGHT_COLOR}
                        style={[styles.input, extraInputStyle]}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        secureTextEntry={secureTextEntry && !isPasswordVisible}
                        {...rest}
                    />}
                {showSecureToggle && (
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Icon
                            name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                            size={22}
                            color={COLORS.LIGHT_COLOR}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 6,
    },
    btnTextStyle: {
        fontSize: calculatefontSize(1.9),
        fontWeight: '600',
        bottom: 10,
        color: COLORS?.PRIMARY_COLOR_LIGHT
    },
    label: {
        color: '#627585',
        // marginBottom: 5,
        fontWeight: '600',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        // borderRadius: 10,
        // paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    disabledContainer: {
        opacity: 0.6,
        backgroundColor: '#f2f2f2',
    },
    input: {
        flex: 1,
        fontSize: calculatefontSize(1.9),
        fontWeight: '300',
        // minHeight: 45,
        // paddingVertical: 10,
        color: '#333',
    },
});

export default TextInputWithTitle;
