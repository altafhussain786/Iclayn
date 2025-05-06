import React from 'react';
import { TextInput, View, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import MyText from './MyText';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const InputWIthIcon = ({
    onPress = () => { },
    value,
    editable = true,
    onChangeText,
    placeholder,
    extraStyle = {},
    extraInputStyle = {},
    title,
    IconName,
    ...rest
}) => {
    return (
        <View style={[styles.container, extraStyle]}>

            <TextInput
                editable={editable}
                placeholderTextColor={COLORS?.LIGHT_COLOR}
                style={[styles.input, extraInputStyle]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                multiline
                {...rest}
            />
            <TouchableOpacity onPress={onPress}>
                {IconName && <MaterialCommunityIcons name={IconName} size={24} color={COLORS?.PRIMARY_COLOR} />}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", justifyContent: "space-between",
        paddingHorizontal: 10,
        alignItems: "center",
        borderWidth: 1,
        marginVertical: 5,
        borderColor: '#ccc',
        borderRadius: 8,
        // paddingHorizontal: 10,
        // paddingVertical: 5,
        // marginVertical: 5,
        backgroundColor: 'white',
    },
    input: {
        width: "90%",
        fontSize: 13,
        minHeight: 40,
        textAlignVertical: 'top', // Keeps text at the top for multiline input
    },
});

export default InputWIthIcon;
