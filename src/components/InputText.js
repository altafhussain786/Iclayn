// import React from 'react';
// import { TextInput, View, StyleSheet } from 'react-native';
// import { COLORS } from '../constants';
// import MyText from './MyText';


// const InputText = ({
//   value,
//   editable = true,
//   onChangeText,
//   placeholder,
//   extraStyle = {},
//   extraInputStyle = {},
//   title,
//   ...rest
// }) => {
//   return (
//     <View style={[styles.container, extraStyle]}>
//       {title && <MyText >{title}</MyText>}
//       <TextInput
//         editable={editable}
//         placeholderTextColor={COLORS?.LIGHT_COLOR}
//         style={[styles.input, extraInputStyle]}
//         placeholder={placeholder}
//         value={value}
//         onChangeText={onChangeText}
//         multiline
//         {...rest}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // borderWidth: 1,
//     marginVertical: 5,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     // marginVertical: 5,
//     // backgroundColor: 'white',
//   },
//   input: {
//     // backgroundColor: 'white',
//     fontSize: 16,
//     minHeight: 40,
//     textAlignVertical: 'top', // Keeps text at the top for multiline input
//   },
// });

// export default InputText;

import React from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants';
import MyText from './MyText';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library you're using

const InputText = ({
  value,
  editable = true,
  onChangeText,
  placeholder,
  extraStyle = {},
  extraInputStyle = {},
  title,
  iconName, // e.g., 'email', 'lock', 'person'
  onIconPress, // optional action on icon press
  secureTextEntry = false,
  ...rest
}) => {
  return (
    <View style={[styles.wrapper, extraStyle]}>
      {title && <MyText style={styles.label}>{title}</MyText>}
      <View style={[styles.container, !editable && styles.disabledContainer]}>
      {iconName && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon name={iconName} size={22} color={COLORS.LIGHT_COLOR} />
          </TouchableOpacity>
        )}
        <TextInput
          editable={editable}
          placeholderTextColor={COLORS.LIGHT_COLOR}
          style={[styles.input, extraInputStyle]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          {...rest}
        />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  disabledContainer: {
    opacity: 0.6,
    backgroundColor: '#f2f2f2',
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 45,
    paddingVertical: 10,
    color: '#333',
  },
});

export default InputText;
