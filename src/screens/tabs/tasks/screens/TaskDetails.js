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

const TaskDetails = ({ navigation }) => {
    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Task Details" />
            <DescriptionContainer isShowLoader={false} title={'Sign documents'} description={'Due Today, 25 june'} />
            <Wrapper style={{ padding: 0,backgroundColor:'#F5F6F8' }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <TitleHeading title="Task Details" description="Pending" />
                    <ContentContainer title='Status'  description="Pending" />
                    <ContentContainer title='Description' description='' />
                    <ContentContainer title='Related Matter' />
                    <ContentContainer title='Assign to' description='Andrea Black' />
                    <ContentContainer title='Assign by' description='Andrea Black' />
                    <ContentContainer title='Task type' description='' />
                    <ContentContainer title='Time estimate' description='' />
                    <ContentContainer title='Reminders' description='' />
                    <TitleHeading title="Related time" />
                    <AddItemContainer title='Add a time entry' onPress={() => { Alert.alert("dfjdljh") }} />

                        {/* //Footer  */}
                        <View 
                        style={{height:100}}/>
                </ScrollView>
            </Wrapper>
        </>
    )
}


const ContentContainer = ({  style, title = "", description = "" }) => {
    return (

        <>
            <View style={[styles.container, style]}>
                <View>
                    <View style={{ height: 35, width: 35, backgroundColor: description ? '#A3DBFF' : '#D0D9E0', justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                        <AntDesign name="calendar" size={20} color={description ? '#012A68' : COLORS?.BLACK_COLOR} />
                    </View>
                </View>

                {/* //Text style here ===> */}
                <View style={{ borderBottomWidth: title == "Reminders" ? 0 : 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingBottom: 15, width: '80%' }}>
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

export default TaskDetails

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