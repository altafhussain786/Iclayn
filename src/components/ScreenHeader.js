import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MyText from './MyText';
import { COLORS } from '../constants';
import { calculatefontSize } from '../helper/responsiveHelper';
import { useSelector } from 'react-redux';

const ScreenHeader = ({
  isShowTitle = false,
  title = 'Inventory',
  onPress = () => { },
  isGoBack = false
}) => {
  const userDetails = useSelector(state => state?.userDetails?.userDetails);
  const { userProfileDTO } = userDetails
  const imageURL = `data:image/jpeg;base64,${userProfileDTO?.image}`;
  return (
    <View style={styles.container1}>
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
            <Feather name={'bell'} size={20} color={COLORS?.whiteColors} />

          </TouchableOpacity>
          <Image source={{ uri: imageURL }} style={{ height: 30, width: 30, borderRadius: 50, resizeMode: "contain" }} />
        </View>
      </View>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
  container1: {
    backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: 10,
    backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT,
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
    fontSize: calculatefontSize(2),
    color: COLORS?.whiteColors,
    fontWeight: '400'
  }
});
