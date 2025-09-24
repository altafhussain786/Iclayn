import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS, fontFamily, IconUri } from '../constants';
import { calculatefontSize } from '../helper/responsiveHelper';


const SearchBar = ({
    value,
    onChangeText,
    placeholder = "Search...",
    onClear,
    style,
    iconSize = 20,
    iconColor = COLORS.LIGHT_COLOR,
    inputStyle,
    containerStyle
}) => {
    const [internalValue, setInternalValue] = useState('');

    useEffect(() => {
        // Sync external value (if provided)
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const handleChange = (text) => {
        setInternalValue(text);
        if (onChangeText) {
            onChangeText(text);
        }
    };
    const handleClear = () => {
        setInternalValue('');
        if (onChangeText) {
            onChangeText('');
        }
        if (onClear) {
            onClear(); // optional external onClear call
        }
    };
    return (
        <View style={[styles.container, containerStyle]}>
            <Image tintColor={COLORS?.PRIMARY_COLOR} source={IconUri?.newSearch} style={{ height: 20, width: 20, resizeMode: 'contain' }} />
            {/* <AntDesign name="search1" size={iconSize} color={iconColor} style={styles.icon} /> */}
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={COLORS.LIGHT_COLOR}
                style={[styles.input, inputStyle]}
            />
            {internalValue.length > 0 && (
                <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                    <AntDesign name="closecircle" size={iconSize} color={COLORS.LIGHT_COLOR} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.BORDER_LIGHT_COLOR,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 40,
        marginBottom: 10,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: calculatefontSize(1.8),
        // fontFamily: fontFamily.regulaer,
        color: COLORS.BLACK_COLOR,
    },
    clearButton: {
        marginLeft: 8,
    }
});

export default SearchBar;
