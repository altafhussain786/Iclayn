import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenHeader from '../../../components/ScreenHeader'

const AppSettings = ({ navigation }) => {
    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Reports' />
            <View>
                <Text>AppSettings</Text>
            </View>
        </>
    )
}

export default AppSettings

const styles = StyleSheet.create({})