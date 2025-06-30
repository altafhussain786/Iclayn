import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesgin from 'react-native-vector-icons/AntDesign'
import MyText from './MyText'
import { COLORS } from '../constants'

const AddButton = ({ onPress, title = "Add related contact" }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: "row", alignItems: "center", gap: 5, marginVertical: 10 }}>
            <AntDesgin name="pluscircle" color={COLORS?.PRIMARY_COLOR_LIGHT} size={20} />
            <MyText style={{ color: COLORS?.PRIMARY_COLOR_LIGHT }}>{title}</MyText>
        </TouchableOpacity>
    )
}

export default AddButton