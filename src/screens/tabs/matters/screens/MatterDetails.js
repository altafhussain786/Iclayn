import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenHeader from '../../../../components/ScreenHeader'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import DescriptionContainer from '../components/DescriptionContainer'
import { COLORS, FONT_WEIGHT_REGULAR, IconUri } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import ContentContainer from '../components/ContentContainer'

//
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import httpRequest from '../../../../api/apiHandler'


const { height } = Dimensions.get('window');
const MatterDetails = ({ navigation, route }) => {
    const matterData = route?.params?.matterData

    const flatListRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const layoutHeight = event.nativeEvent.layoutMeasurement.height;
        const contentHeight = event.nativeEvent.contentSize.height;

        if (offsetY + layoutHeight >= contentHeight - 20) {
            setIsAtBottom(true);
        } else if (offsetY <= 20) {
            setIsAtBottom(false);
        }
    };

    const scrollToTopOrBottom = () => {
        if (isAtBottom) {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        } else {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    };
    console.log(matterData, "=d==>");

    const [tabs, setTabs] = React.useState('All');
    const [contactdetails, setContactdetails] = React.useState([]);
    const [matterDetails, setMatterDetails] = React.useState({});
    const [matterLoading, setMatterLoading] = React.useState(false);
    const tabList = [
        {
            id: 1,
            value: 'Event',
            title: 'Event',
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 2,
            value: 'Time Entry',
            title: 'Time Entry',
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 3,
            value: 'Expense',
            title: 'Expense',
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 4,
            value: 'Task',
            title: 'Task',
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 5,
            value: 'Note',
            title: 'Note',
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        }
    ];
    //Matter content Data
    const matterContentData = [
        {
            id: 1,
            title: 'Activities',
            value: "activities",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.Tasks
        },
        {
            id: 2,
            title: 'Notes',
            value: "notes",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 3,
            title: 'Documents',
            value: "documents",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 4,
            title: 'Bills',
            value: "bills",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 5,
            title: 'Communication logs',
            value: "communicationLogs",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 6,
            title: 'Calender Event',
            value: "calenderEvent",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 7,
            title: 'Task',
            value: "task',",
            description: "test description",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        }
    ]

    const financialData = [
        {
            id: 1,
            title: 'OutstandingBalance',
            value: "outstandingBalance",
            description: "0.00 GBP",
            color: '#B6F0E3',
            onPress: () => { },
            iconUri: IconUri?.Bills
        },
        {
            id: 2,
            title: 'MatterClientFunds',
            value: "matterClientFunds",
            description: "0.00 GBP",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
        {
            id: 3,
            title: 'Work in progress',
            value: 'workinProgress',
            description: "0.00 GBP",
            onPress: () => { },
            iconUri: IconUri?.CalenderColor
        },
    ]


    const getContactDetails = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/4/client`,
            navigation: navigation
        })
        if (res) {
            // console.log(res, "CLIENT=d===>");

            setContactdetails(res?.data);

        }
        else {
            console.log("err", err);
        }
    }
    const getMatterDetails = async () => {
        setMatterLoading(true)
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/${matterData?.matterId}`,
            navigation: navigation
        })
        if (res) {
            // console.log(res, "CLIENT=d===>");
            setMatterLoading(false)

            setMatterDetails(res?.data);

        }
        else {
            setMatterLoading(false)

            console.log("err", err);
        }
    }

    useEffect(() => {
        getMatterDetails()
        getContactDetails()
    }, [])


    return (
        <>
            <StatusBar backgroundColor={COLORS.PRIMARY_COLOR_LIGHT} barStyle="light-content" />
            <ScreenHeader  isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Matters" />
            <DescriptionContainer isShowLoader={matterLoading} title={matterDetails?.code} description={matterDetails?.description} />
            <Wrapper>
                <FlatList
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    ListHeaderComponent={() => {
                        return (
                            <>
                                <MyText style={{ marginBottom: 10 }}>Create New</MyText>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={tabList}
                                    renderItem={({ item, i }) => {
                                        return (
                                            <>
                                                <View style={{}}>
                                                    <TouchableOpacity
                                                        key={item}
                                                        style={[
                                                            styles.tab,
                                                        ]}
                                                        onPress={() => setTabs(item?.value)}
                                                    >
                                                        <Image tintColor={'#DEEBD5'} source={item?.iconUri} style={{ width: 25, height: 25, resizeMode: "contain" }} />
                                                    </TouchableOpacity>
                                                    <MyText
                                                        style={styles.tabText}
                                                        numberOfLines={1}
                                                    >
                                                        {item?.title}
                                                    </MyText>
                                                </View>
                                            </>
                                        )
                                    }}
                                />
                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Matter Content</MyText>
                                <ContentContainer>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={matterContentData}
                                        renderItem={({ item, i }) => (
                                            <>
                                                <View style={{ flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: item?.id === 7 ? 0 : 0.5, borderColor: COLORS?.LIGHT_COLOR, alignItems: "center", paddingBottom: 10 }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                        <View style={{ backgroundColor: "#A3DAFF", height: 30, width: 30, padding: 15, justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                                                            <Image tintColor={COLORS?.PRIMARY_COLOR} source={item?.iconUri} style={{ width: 15, height: 15, resizeMode: "contain" }} />
                                                        </View>
                                                        <View>

                                                            <MyText style={{ marginTop: 5, color: COLORS?.BLACK_COLOR, fontWeight: "bold" }}>{item?.title}</MyText>
                                                            <MyText>{item?.description}</MyText>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity>
                                                        <AntDesign name="right" size={15} color={COLORS?.LIGHT_COLOR} />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    />
                                </ContentContainer>
                                {/* //Contact Details  */}
                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Contact Details</MyText>
                                <ContentContainer>
                                    <View style={{ flexDirection: "row", gap: 10, }} >
                                        <View >
                                            <View style={{ backgroundColor: "#F9D596", height: 30, width: 30, justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                                                <MyText style={{ fontWeight: "bold", color: '#641700' }}>U</MyText>
                                            </View>
                                        </View>
                                        <View style={{ width: '70%', }}>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Client</MyText>
                                                <MyText style={{ fontWeight: "bold", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{contactdetails[0]?.firstName + " " + contactdetails[0]?.lastName}</MyText>
                                            </View>
                                            <View style={{ paddingVertical: 10 }}>
                                                <MyText>Email</MyText>
                                                <MyText style={{ fontWeight: "bold", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{contactdetails[0]?.clientEmailAddressDTOList[0]?.email}</MyText>
                                            </View>
                                            <View style={{ paddingVertical: 10 }}>
                                                <MyText>Phone</MyText>
                                                <MyText style={{ fontWeight: "bold", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{contactdetails[0]?.clientPhoneNumberDTOList
                                                [0]?.phoneNo}</MyText>
                                            </View>
                                            <View style={{ paddingVertical: 10 }}>
                                                <MyText>Address</MyText>
                                                <MyText style={{ fontWeight: "bold", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{contactdetails[0]?.clientAddresseDTOList
                                                [0]?.city + ", " + contactdetails[0]?.clientAddresseDTOList[0]?.country}</MyText>
                                            </View>
                                        </View>
                                    </View>
                                </ContentContainer>
                                {/* //Contact Details  */}
                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Matter Details</MyText>
                                <ContentContainer>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Matter Status</MyText>
                                        <MyText style={{ fontWeight: "bold", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{matterDetails?.status}</MyText>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Matter description</MyText>
                                        <MyText style={{ fontWeight: "400", color: COLORS?.BLACK_COLOR, fontSize: calculatefontSize(1.5) }}>{matterDetails?.description}</MyText>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Responsible solcitor</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>-</MyText>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Originatig solcitor</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>-</MyText>
                                    </View>

                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Matter notification</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>-</MyText>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Limitation date</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>-</MyText>
                                    </View>
                                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 5 }}>
                                        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", top: 5, gap: 10 }}>
                                            <MyText style={{ color: COLORS?.PRIMARY_COLOR_LIGHT, fontWeight: "bold" }}>View 8 more</MyText>
                                            <FontAwesome5 name="caret-down" style={{ top: 2 }} size={20} color={COLORS?.PRIMARY_COLOR_LIGHT} />
                                        </TouchableOpacity>
                                    </View>
                                </ContentContainer>

                                {/* //Financial ============= */}
                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Financial</MyText>
                                <ContentContainer>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={financialData}
                                        renderItem={({ item, i }) => (
                                            <>
                                                <View style={{ flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: item?.id === 3 ? 0 : 0.5, borderColor: COLORS?.LIGHT_COLOR, alignItems: "center", paddingBottom: 10 }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                        <View style={{ backgroundColor: item?.color ? item?.color : "#A3DAFF", height: 30, width: 30, padding: 15, justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                                                            <Image tintColor={COLORS?.PRIMARY_COLOR} source={item?.iconUri} style={{ width: 15, height: 15, resizeMode: "contain" }} />
                                                        </View>
                                                        <View>
                                                            <MyText style={{ marginTop: 5, color: COLORS?.BLACK_COLOR }}>{item?.title}</MyText>
                                                            <MyText style={{ fontWeight: "600", color: COLORS?.BLACK_COLOR }}>{item?.description}</MyText>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity>
                                                        <AntDesign name="right" size={15} color={COLORS?.LIGHT_COLOR} />
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}
                                    />
                                    <View style={{ borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Total time recorded</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>0.00 GBP</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Total expense recorded</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>0.00 GBP</MyText>
                                    </View>
                                </ContentContainer>
                                {/* //Practice area ============= */}
                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Practice area</MyText>
                                <ContentContainer>
                                    <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, marginVertical: 10 }}>General</MyText>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                        <MyText style={{ width: "40%", fontWeight: "bold" }}>Reference:</MyText>
                                        <MyText style={{ color: COLORS?.GREY_COLOR, }}>123</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                        <MyText style={{ width: "40%", fontWeight: "bold" }}>Referal:</MyText>
                                        <MyText style={{ color: COLORS?.GREY_COLOR, }}>dev test</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                        <MyText style={{ width: "40%", fontWeight: "bold" }}>Referal Fee:</MyText>
                                        <MyText style={{ color: COLORS?.GREY_COLOR, }}>123.00</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                        <MyText style={{ width: "40%", fontWeight: "bold" }}>Negotiator (Party):</MyText>
                                        <MyText style={{ color: COLORS?.GREY_COLOR, }}>Irfan Ali</MyText>
                                    </View>
                                    <View>
                                        <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                            <MyText style={{ width: "40%", fontWeight: "bold" }}>Negotiator's Fee (Party):</MyText>
                                            <MyText style={{ color: COLORS?.GREY_COLOR, }}>123.00</MyText>
                                        </View>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, marginBottom: 10 }}>Property Address</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, }}>Property Details</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, flexDirection: "row", gap: 30 }}>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, }}>Other</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, }}>
                                        <MyText style={{ color: COLORS?.GREY_COLOR, }}>No item</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, }}>Party (Seller)</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, }}>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, }}>Transfer</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, }}>
                                        <MyText style={{ color: COLORS?.GREY_COLOR, }}>No item</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT, }}>Key Dates</MyText>
                                    </View>
                                </ContentContainer>
                                <View style={{justifyContent:"center",alignItems:"center",marginVertical:30}}>
                                    <TouchableOpacity onPress={scrollToTopOrBottom} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                        <MyText style={{ color: COLORS?.GREY_COLOR }}>Back to Top </MyText>
                                        <MaterialIcons
                                            name={'arrow-upward'}
                                            size={24}
                                            color={COLORS?.GREY_COLOR}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginBottom: 30 }} />
                            </>
                        )
                    }}

                />

               {/* {isAtBottom && <TouchableOpacity style={styles.fab} onPress={scrollToTopOrBottom}>
                    <MaterialIcons
                        name={isAtBottom ? 'arrow-upward' : 'arrow-downward'}
                        size={24}
                        color="white"
                    />
                </TouchableOpacity>} */}
                {/* //More content Data  */}


            </Wrapper>
        </>
    )
}

export default MatterDetails

const styles = StyleSheet.create({
    tab: {
        // paddingVertical: 6,
        height: 60,
        width: 60,
        backgroundColor: '#71A24B',
        // paddingHorizontal: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: '400',
        color: COLORS?.BLACK_COLOR,
        fontSize: calculatefontSize(1.7),
    },
    fab: {
        position: 'absolute',
        bottom: 70,
        right: 20,
        backgroundColor: '#007AFF',
        borderRadius: 30,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
})