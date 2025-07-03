import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MyText from './MyText';
import { COLORS } from '../constants';
import { calculatefontSize } from '../helper/responsiveHelper';
import { useSelector } from 'react-redux';

import LoaderKit from 'react-native-loader-kit'

const ScreenHeader = ({
  isShowTitle = false,
  title = 'Inventory',
  onPress = () => { },
  isGoBack = false,
  isLoading=false,
  isShowSave=false,
  isSHowSaveButton=false,
  onPressSave = () => { }, // ✅ Added
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
          )}
        </View>

        {/* Right Side Icons */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

          <TouchableOpacity onPress={onPress} style={styles.iconWrapper}>
            <Feather name={'bell'} size={20} color={COLORS?.whiteColors} />
          </TouchableOpacity>
          {isShowSave &&
            isLoading ? <LoaderKit
            style={{ width: 30, height: 30 }}
            name={'BallSpinFadeLoader'} // Optional: see list of animations below
            color={COLORS?.whiteColors} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
          /> :
            isShowSave &&
            <TouchableOpacity onPress={onPressSave} style={styles.iconWrapper}>
              <Feather name={'save'} size={20} color={COLORS?.whiteColors} />
            </TouchableOpacity>

          }
          <Image
            source={{ uri:userProfileDTO?.image ? imageURL : 'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740' }}
            style={{ height: 30, width: 30, borderRadius: 50, resizeMode: "contain", }}
          />
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
    width: 30,
    alignItems: 'center'
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  titleText: {
    fontSize: calculatefontSize(2),
    color: COLORS?.whiteColors,
    fontWeight: '600'
  }
});
