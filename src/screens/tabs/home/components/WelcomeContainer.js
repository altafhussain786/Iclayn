import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MyText from '../../../../components/MyText'
import { COLORS } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import { useSelector } from 'react-redux'

const WelcomeContainer = () => {
    const userDetails=useSelector(state=>state?.userDetails?.userDetails);
    console.log(userDetails,"userDetails=====>");
    const {userProfileDTO}=userDetails
      const imageURL = `data:image/jpeg;base64,${userProfileDTO?.image}`;
    return (
        <>
            <View style={styles.container}>
                <View>
                    <Image source={{ uri: imageURL }} style={{ height: 30, width: 30, borderRadius: 50 ,resizeMode:"contain"}}/>
                    <MyText style={styles.nameStyle}>Hi, {userProfileDTO?.fullName}</MyText>
                </View>
                <View>
                    <MyText style={styles.messageStyle}>You have <Text style={{ color: COLORS?.yellow }}>3 appointments </Text> </MyText>
                    <MyText style={styles.messageStyle}>and <Text style={{ color: COLORS?.yellow }}> 1 task </Text> schedule today</MyText>
                </View>
            </View>
        </>
    )
}

export default WelcomeContainer

const styles = StyleSheet.create({
    container: {
        flex: 0.3,
        paddingHorizontal: 20,
        gap: 10,
        backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT
    },
    nameStyle: {
        color: COLORS?.whiteColors,
        fontSize: calculatefontSize(4),
        fontWeight: "bold"
    },
    messageStyle: {
        color: COLORS?.whiteColors,
        fontSize: calculatefontSize(2),
        fontWeight: "600"
    }
})