import React from 'react';
import { View, StyleSheet } from 'react-native';
import { responsiveWidth as wp } from 'react-native-responsive-dimensions';

const ContentContainer = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default ContentContainer;

const styles = StyleSheet.create({
  container: {
    marginHorizontal:5,
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 10, // Rounded corners
    padding: wp(4), // Adjust padding
    marginVertical: wp(2),
    borderColor: '#ccc',
    borderWidth:0.5,
    boxShadow: ' 2px 2px 4px rgba(0, 0, 0, 0.1)',
   
  },
});
