import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenHeader from '../../../components/ScreenHeader'
import Wrapper from '../../../components/Wrapper'
import MyText from '../../../components/MyText'

const Documents = ({ navigation }) => {
    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Documents' />
            <Wrapper>
                <MyText>hello</MyText>
            </Wrapper>
        </>
    )
}

export default Documents

const styles = StyleSheet.create({})