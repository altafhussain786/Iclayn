import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenHeader from '../../../components/ScreenHeader'

const Reports = ({ navigation }) => {
    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Reports' />
            <View>
                <Text>Reports</Text>
            </View>
        </>
    )
}

export default Reports

const styles = StyleSheet.create({})