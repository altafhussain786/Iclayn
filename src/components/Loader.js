import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { COLORS } from '../../constants';
import LoaderKit from 'react-native-loader-kit'
import { COLORS } from '../constants'

const Loader = ({
    color = COLORS?.PRIMARY_COLOR,
}) => {
  return (
      <View style={styles.container}>
          <LoaderKit
              style={{ width: 35, height: 35 }}
              name={'BallSpinFadeLoader'} // Optional: see list of animations below
              color={color} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
          />
      </View>
  )
}

export default Loader

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }
})