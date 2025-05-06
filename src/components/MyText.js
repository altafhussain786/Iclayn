import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { responsiveWidth as wp, responsiveHeight as hp, responsiveFontSize as fp } from 'react-native-responsive-dimensions';
// import { PRIMARY_FONT } from '../../constants';


const MyText = ({
    children,
    style = {},
    color = '#000',
    type = 'p', // Default text type (h1, h2, h3, h4, h5, h6, p, small)

    textAlign = 'left',
    ellipsizeMode=undefined,
    fontSize = wp(3.8),
    numberOfLines = undefined,
    // fontFamily = PRIMARY_FONT,
    ...rest
}) => {
    // Define font sizes based on HTML tags
    const fontSizes = {
        h1: wp(8),  // Largest
        h2: wp(7),
        h3: wp(6),
        h4: wp(5),
        h5: wp(4.5),
        h6: wp(4),
        p: wp(3.8), // Default paragraph size
        small: wp(3), // Smallest
    };

    return (
        <Text
        ellipsizeMode={ellipsizeMode}
            style={[
                styles.text,
                { color, fontSize: fontSizes[type] || wp(fontSize), textAlign,
                    // fontFamily:fontFamily
                 },
                style,
            ]}
            numberOfLines={numberOfLines}
            {...rest}
        >
            {children}
        </Text>
    );
};

export default MyText;

const styles = StyleSheet.create({
    text: {
        // fontFamily: PRIMARY_FONT,
        fontSize: wp(3.8), // Default to paragraph size
    },
});
