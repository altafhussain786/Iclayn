import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import MyText from './MyText'
import { COLORS } from '../constants'
import { calculatefontSize } from '../helper/responsiveHelper'

const AddItemContainer = ({title="",onPress=()=>{}}) => {
    return (
        <>
            <TouchableOpacity onPress={onPress} style={styles.container}>
                <View style={styles.plusContainer}>
                    <AntDesign name="plus" size={25} color="#015354" />
                </View>
                <MyText style={styles.txtStyle}>{title}</MyText>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:COLORS?.whiteColors,
        padding: 10,
        flexDirection:"row",
        alignItems:"center",
        gap:10
    },
    plusContainer: {
        height: 30,
        width: 30,
        backgroundColor: "#B6F0E2",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center"
    },
    txtStyle:{
        fontSize:calculatefontSize(1.9),
        fontWeight:"bold",
        color:COLORS?.PRIMARY_COLOR_LIGHT
    }
})
export default AddItemContainer