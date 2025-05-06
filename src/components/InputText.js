import React from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { COLORS } from '../constants';
import MyText from './MyText';


const InputText = ({
  value,
  editable = true,
  onChangeText,
  placeholder,
  extraStyle = {},
  extraInputStyle = {},
  title,
  ...rest
}) => {
  return (
    <View style={[styles.container, extraStyle]}>
      {title && <MyText >{title}</MyText>}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    marginVertical: 5,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // marginVertical: 5,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    minHeight: 40,
    textAlignVertical: 'top', // Keeps text at the top for multiline input
  },
});

export default InputText;
