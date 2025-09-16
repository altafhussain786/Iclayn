import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, fontFamily } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import Loader from '../../../../components/Loader'
import LoaderKit from 'react-native-loader-kit'
import LinearGradient from 'react-native-linear-gradient'

const DescriptionContainer = ({ isShowLoader, title, description }) => (

    <LinearGradient
        colors={[COLORS.PRIMARY_COLOR, COLORS.PRIMARY_COLOR_LIGHT,]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
    >
        <View >
            {isShowLoader ? <LoaderKit
                style={{ width: 35, height: 35 }}
                name={'BallSpinFadeLoader'} // Optional: see list of animations below
                color={COLORS?.whiteColors} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
            /> :
                <>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.description}>{description}</Text>
                </>
            }
        </View>
    </LinearGradient>
)

export default DescriptionContainer

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    title: {
        fontSize: calculatefontSize(2),
        // fontFamily:fontFamily.Bold,
        fontWeight: "bold",
        color: COLORS.whiteColors,

    },
    description: {
        fontSize: calculatefontSize(1.5),
        color: COLORS.whiteColors,
        marginBottom: 5

    }
})