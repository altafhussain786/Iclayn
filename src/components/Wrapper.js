import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { responsiveWidth as wp } from 'react-native-responsive-dimensions';
import { getResponsiveWidth } from '../helper/responsiveHelper';
import { COLORS } from '../constants';





const Wrapper = ({ children, style }) => {
    return <View style={[styles.container, style]}>{children}</View>;
};

export default Wrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:getResponsiveWidth(99.99),
        backgroundColor:"white",
        padding: wp(5), // Equivalent to 20 in most cases
    },
});
