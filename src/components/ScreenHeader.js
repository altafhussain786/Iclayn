import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MyText from './MyText';
import LogoText from './LogoText';
import { COLORS } from '../constants';

const ScreenHeader = ({
  isShowTitle = false,
  title = 'Inventory',
  onPress = () => { },
  isGoBack = false
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
        <Feather name={isGoBack ? 'arrow-left' : 'settings'} size={20} color={COLORS?.whiteColors} />
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        {isShowTitle && (

          <MyText style={styles.titleText}>{title}</MyText>
        )
        }
      </View>

      {/* Placeholder to center the title */}
      <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
        <Feather name={'bell'} size={20} color={COLORS?.whiteColors} />
      </TouchableOpacity>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS?. PRIMARY_COLOR_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 30,

  },
  iconWrapper: {
    width: 30, // Ensures symmetry for centered title/logo
    alignItems: 'center'
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  titleText: {
    fontSize: 20,
    color: COLORS?.whiteColors,
    fontWeight: '600'
  }
});
