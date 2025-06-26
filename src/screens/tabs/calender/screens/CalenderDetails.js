import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenHeader from '../../../../components/ScreenHeader'
import DescriptionContainer from '../../matters/components/DescriptionContainer'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import { COLORS } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import AntDesign from 'react-native-vector-icons/AntDesign'
import AddItemContainer from '../../../../components/AddItemContainer'

const CalenderDetails = ({ navigation }) => {
    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Calender" />
            <DescriptionContainer isShowLoader={false} title={'Metting with client'} description={'Today,25 june at  10:00 am'} />
            <Wrapper style={{ padding: 0,backgroundColor:'#F5F6F8' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TitleHeading title="Event Details" />
                    <ContentContainer title='Location' />
                    <ContentContainer title='Description' description='Meeting description' />
                    <ContentContainer title='Reminders' description='' />
                    <ContentContainer title='Related Matters' description='Meeting description' />
                    <ContentContainer title='Calendar' description='Andrea Black' />
                    <TitleHeading title="Related time" />
                    <AddItemContainer title='Add a time entry' onPress={() => { Alert.alert("dfjdljh") }} />
                </ScrollView>
            </Wrapper>
        </>
    )
}


export const ContentContainer = ({ children, style, title = "", description = "" }) => {
    return (

        <>
            <View style={[styles.container, style]}>
                <View>
                    <View style={{ height: 35, width: 35, backgroundColor: description ? '#A3DBFF' : '#D0D9E0', justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                        <AntDesign name="calendar" size={20} color={description ? '#012A68' : COLORS?.BLACK_COLOR} />
                    </View>
                </View>

                {/* //Text style here ===> */}
                <View style={{ borderBottomWidth: title == "Calendar" ? 0 : 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingBottom: 15, width: '80%' }}>
                    <MyText style={styles.titleStyle}>{title}</MyText>
                    <MyText style={[styles.descriptionStyle, { color: description ? COLORS?.BLACK_COLOR : '#506578' }]}>{description ? description : '__'}</MyText>
                </View>
            </View>
        </>

    )
}

const TitleHeading = ({ title }) => (
    <View style={{ paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#F5F6F8' }}>
        <Text style={{ fontSize: calculatefontSize(1.9), fontWeight: 'bold', color: COLORS?.BLACK_COLOR }}>{title}</Text>
    </View>
)

export default CalenderDetails

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS?.whiteColors,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: "row",
        // alignItems:"center",
        gap: 15
    },
    titleStyle: {
        fontSize: calculatefontSize(1.9),
        // fontWeight:"bold",
        color: '#506578'
    },
    descriptionStyle: {
        fontSize: calculatefontSize(1.9),
        fontWeight: "700",

    },
})