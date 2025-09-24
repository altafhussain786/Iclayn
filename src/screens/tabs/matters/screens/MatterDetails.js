import { Dimensions, FlatList, Image, ScrollView, SectionList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenHeader from '../../../../components/ScreenHeader'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import DescriptionContainer from '../components/DescriptionContainer'
import { COLORS, FONT_WEIGHT_REGULAR, IconUri } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import ContentContainer from '../components/ContentContainer'

//
import AntDesign from 'react-native-vector-icons/AntDesign';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'

import httpRequest from '../../../../api/apiHandler'
import moment from 'moment'
import { formatNumber } from '../../../../helper/Helpers'

//

const { height, width } = Dimensions.get('window');
const tabSize = width * 0.16; // 16% of screen width -> responsive
const MatterDetails = ({ navigation, route }) => {
    const matterData = route?.params?.matterData

    const flatListRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);
    const [user, setUser] = useState([]);
    const [timeLineData, setTimeLineData] = useState([]);
    const [partiesData, setPartiesData] = useState({});

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
            title: 'Time Entry',
            onPress: () => { navigation.navigate("CreateTimeEntry", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.time} style={{ height: 30, width: 30 }} />

        },
        {
            id: 9,
            title: 'New Expense',
            onPress: () => { navigation.navigate("CreateExpense", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.expense} style={{ height: 30, width: 30 }} />

        },
        {
            id: 2,
            value: 'Event',
            title: 'Event',
            onPress: () => { navigation.navigate("EditEvent", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.event} style={{ height: 30, width: 30 }} />


        },
        {
            id: 3,
            value: 'Task',
            title: 'Task',
            onPress: () => { navigation.navigate("CreateTask", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.task} style={{ height: 30, width: 30 }} />


        },

        {
            id: 4,
            title: 'Documents',

            onPress: () => { navigation.navigate("Documents", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.documents} style={{ height: 30, width: 30 }} />


        },

        {
            id: 5,
            value: 'Note',
            title: 'Note',
            onPress: () => { navigation.navigate("CreateNotes", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.notes} style={{ height: 30, width: 30 }} />


        },

        {
            id: 6,
            title: 'Bills',
            onPress: () => { navigation.navigate("CreateBilling", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.bill} style={{ height: 30, width: 30 }} />

        },

        {
            id: 7,
            title: 'Transactions',
            onPress: () => { navigation.navigate("Transaction", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.transaction} style={{ height: 30, width: 30 }} />


        },
        {
            id: 12,
            title: 'Client Fund',
            onPress: () => { navigation.navigate("CreateTransaction", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.clientFund} style={{ height: 30, width: 30 }} />

        },
        {
            id: 13,
            title: 'Receive Advance',
            onPress: () => { navigation.navigate("CreateReceiveAdvance", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.receiveAdvance} style={{ height: 30, width: 30 }} />

        },
        {
            id: 14,
            title: 'Transfer Advance',
            onPress: () => { navigation.navigate("CreateTransferAdvance", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.receiveAdvance} style={{ height: 30, width: 30 }} />

        },

        // {
        //     id: 8,
        //     title: 'Communication logs',
        //     onPress: () => { navigation.navigate("Communications", { matterDetails: matterData }) },
        //     iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.communication} style={{ height: 30, width: 30 }} />

        // },
        {
            id: 10,
            title: 'Phone log',
            onPress: () => { navigation.navigate("CreatePhoneLog", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.phoneLogs} style={{ height: 30, width: 30 }} />

        },
        {
            id: 11,
            title: 'Internal log',
            onPress: () => { navigation.navigate("CreateInternalLogs", { matterDetails: matterData }) },
            iconUri: <Image tintColor={COLORS?.PRIMARY_COLOR_LIGHT} source={IconUri?.internalLogs} style={{ height: 30, width: 30 }} />

        },


    ];
    //Matter content Data
    const matterContentData = [
        {
            id: 1,
            title: 'Activities',
            value: "activities",
            description: "test description",
            onPress: () => { navigation.navigate("Activities", { matterDetails: matterData }) },
            iconUri: IconUri?.Activitie
        },
        {
            id: 6,
            title: 'Calender Event',
            value: "calenderEvent",
            description: "test description",
            onPress: () => { navigation.navigate("MatterCalender", { matterDetails: matterData }) },
            iconUri: IconUri?.event
        },
        {
            id: 7,
            title: 'Task',
            value: "task',",
            description: "test description",
            onPress: () => { navigation.navigate("Tasks", { matterDetails: matterData }) },
            iconUri: IconUri?.task
        },
        {
            id: 3,
            title: 'Documents',
            value: "documents",
            description: "test description",
            onPress: () => { navigation.navigate("Documents", { matterDetails: matterData }) },
            iconUri: IconUri?.documents
        },


        {
            id: 2,
            title: 'Notes',
            value: "notes",
            description: "test description",
            onPress: () => { navigation.navigate("Notes", { matterDetails: matterData }) },
            iconUri: IconUri?.notes
        },

        {
            id: 4,
            title: 'Bills',
            value: "bills",
            description: "test description",
            onPress: () => { navigation.navigate("Bills", { matterDetails: matterData }) },
            iconUri: IconUri?.bill
        },
        {
            id: 10,
            title: 'Transactions',
            value: "documents",
            description: "test description",
            onPress: () => { navigation.navigate("Transaction", { matterDetails: matterData }) },
            iconUri: IconUri?.transaction
        },
        {
            id: 5,
            title: 'Communication logs',
            value: "communicationLogs",
            description: "test description",
            onPress: () => { navigation.navigate("Communications", { matterDetails: matterData }) },
            iconUri: IconUri?.communication
        },

    ]

    const financialData = [
        {
            id: 1,
            title: 'Work in progress',
            value: "workinProgress",
            description: formatNumber(partiesData?.workInProgress) || "0.00",
            color: '#B6F0E3',
            onPress: () => { },
            iconUri: IconUri?.event
        },
        {
            id: 2,
            title: 'OutstandingBalance',
            value: "outstandingBalance",
            description: formatNumber(partiesData?.outstandingBalance) || "0.00 ",
            color: '#B6F0E3',
            onPress: () => { },
            iconUri: IconUri?.bill
        },
        {
            id: 3,
            title: 'ClientFunds',
            value: "clientFunds",
            description: formatNumber(partiesData?.receivedClientFund) || "0.00",
            onPress: () => { },
            iconUri: IconUri?.fund
        },
        {
            id: 4,
            title: 'Requested funds',
            value: "requestedFunds",
            description: formatNumber(partiesData?.requestedClientFund) || "0.00",
            onPress: () => { },
            iconUri: IconUri?.fund
        },
        {
            id: 5,
            title: 'Expenses',
            value: 'Expenses',
            description: formatNumber(partiesData?.totalExpense) || "0.00",
            onPress: () => { },
            iconUri: IconUri?.expense
        },
    ]


    const getContactDetails = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/${matterData?.matterId}/client`,
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
    const getTimeLineData = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/${matterData?.matterId}/timeline`,
            navigation: navigation
        })
        if (res) {
            // console.log(res, "CLIENT=d===>");

            setTimeLineData(res?.data);

        }
        else {
            console.log("err", err);
        }
    }
    const getUsers = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res, "CLIENT=d===>");

            setUser(res?.data);

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
            console.log(res?.data, "MATTER DETAILSd");

            setMatterDetails(res?.data);

        }
        else {
            setMatterLoading(false)

            console.log("err", err);
        }
    }
    const getPartiesData = async () => {

        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/${matterData?.matterId}/db`,
            navigation: navigation
        })
        if (res) {
            // console.log(res, "CLIENT=d===>");

            console.log(res?.data, "MATTER DETAILSd");

            setPartiesData(res?.data);

        }
        else {


            console.log("err", err);
        }
    }

    useEffect(() => {
        getPartiesData()
        getTimeLineData()
        getUsers()
        getMatterDetails()
        getContactDetails()
    }, [])

    return (
        <>
            <StatusBar backgroundColor={COLORS.PRIMARY_COLOR_LIGHT} barStyle="light-content" />
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Matters" />
            <DescriptionContainer isShowLoader={matterLoading} title={matterDetails?.code} description={matterDetails?.description} />
            <Wrapper>
                <FlatList
                    ref={flatListRef}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    ListHeaderComponent={() => {
                        return (
                            <>

                                <MyText style={{ marginBottom: 10, fontWeight: "bold" }}>Create New</MyText>
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={tabList}
                                    keyExtractor={(item) => item.id.toString()}
                                    contentContainerStyle={styles.listContainer}
                                    renderItem={({ item }) => (
                                        <View style={styles.itemContainer}>
                                            <TouchableOpacity style={styles.tab} onPress={item.onPress}>
                                                {item?.iconUri}

                                                {/* <Image
                                                    source={item?.iconUri}
                                                    style={styles.icon}
                                                /> */}
                                            </TouchableOpacity>
                                            <MyText style={styles.tabText} numberOfLines={1}>
                                                {item?.title}
                                            </MyText>
                                        </View>
                                    )}
                                />
                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Matter Content</MyText>
                                <ContentContainer>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={matterContentData}
                                        renderItem={({ item, i }) => (
                                            <>
                                                <TouchableOpacity onPress={item?.onPress} style={{ flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: item?.id === 5 ? 0 : 0.5, borderColor: COLORS?.LIGHT_COLOR, alignItems: "center", paddingBottom: 10 }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                        <View style={{ borderWidth: 1, borderColor: COLORS?.LIGHT_COLOR, height: 30, width: 30, padding: 15, justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                                                            <Image tintColor={COLORS?.PRIMARY_COLOR} source={item?.iconUri} style={{ width: 15, height: 15, resizeMode: "contain" }} />
                                                        </View>
                                                        <View>
                                                            <MyText style={{ marginTop: 5, color: COLORS?.BLACK_COLOR, fontWeight: "bold" }}>{item?.title}</MyText>
                                                            <MyText>{item?.description}</MyText>
                                                        </View>
                                                    </View>
                                                    <View onPress={item?.onPress}>
                                                        <AntDesign name="right" size={15} color={COLORS?.LIGHT_COLOR} />
                                                    </View>
                                                </TouchableOpacity>
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
                                                {/* <Text style={{textTransform:"uppercase"}}>Hdkf</Text> */}
                                                <MyText style={{ fontWeight: "bold", color: '#641700', }}>{contactdetails[0]?.firstName?.charAt(0) + contactdetails[0]?.lastName?.charAt(0)}</MyText>
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
                                        <MyText>Supervisor Solicitor</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.supervisorSolicitorName || "-"}</MyText>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Fee Earner Solicitor</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.feeEarnerSolicitorName || "-"}</MyText>
                                    </View>

                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Practice Area</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.practiceAreaName || "-"}</MyText>
                                    </View>
                                    <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Matter stage</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.stage}</MyText>
                                    </View>
                                    {isShowMore &&
                                        <>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Client reference number</MyText>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.clientRefNo || "-"}</MyText>
                                            </View>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Location</MyText>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.location || "-"}</MyText>
                                            </View>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Status</MyText>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.status || "-"}</MyText>
                                            </View>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Open date</MyText>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}> {matterDetails?.openDate ? moment(matterDetails?.openDate).format("DD/MM/YYYY") : "-"}</MyText>
                                            </View>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Pending date</MyText>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.pendingDate ? moment(matterDetails?.pendingDate).format("DD/MM/YYYY") : "-"}</MyText>
                                            </View>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Closed date</MyText>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{matterDetails?.closedDate ? moment(matterDetails?.closedDate).format("DD/MM/YYYY") : "-"}</MyText>
                                            </View>
                                            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                <MyText>Billable</MyText>
                                                {
                                                    matterDetails?.matterBillingDTOList[0]?.matterBillingItemDTOList?.map((data, i) => {
                                                        return (
                                                            <>
                                                                <View style={{ marginBottom: 10, marginTop: 10 }}>
                                                                    <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{user?.find(item => item.userId == data?.userId)?.userProfileDTO?.fullName}</MyText>
                                                                    <MyText style={{ fontWeight: "300", color: COLORS?.BLACK_COLOR, fontSize: calculatefontSize(1.5) }}>£{data?.rate}/{matterDetails?.matterBillingDTOList[0]?.method}</MyText>
                                                                </View>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </View>

                                        </>
                                    }
                                    <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 5 }}>
                                        <TouchableOpacity onPress={() => setIsShowMore(!isShowMore)} style={{ flexDirection: "row", alignItems: "center", top: 5, gap: 10 }}>
                                            <MyText style={{ color: COLORS?.PRIMARY_COLOR_LIGHT, fontWeight: "bold" }}>View 7 more</MyText>
                                            <FontAwesome5 name={isShowMore ? "caret-up" : "caret-down"} style={{ top: 2 }} size={20} color={COLORS?.PRIMARY_COLOR_LIGHT} />
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
                                    {/* <View style={{ borderBottomWidth: 0.5, borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Total time recorded</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>0.00 GBP</MyText>
                                    </View>
                                    <View style={{ borderTopWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                        <MyText>Total expense recorded</MyText>
                                        <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>0.00 GBP</MyText>
                                    </View> */}
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


                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Timeline</MyText>
                                <ContentContainer style={{ padding: 0 }}>
                                    <SectionList
                                        sections={Object.values(
                                            timeLineData.reduce((acc, item) => {
                                                const date = moment(item?.createdOn).format("MMM DD, YYYY"); // e.g., Sep 23, 2025
                                                if (!acc[date]) acc[date] = { title: date, data: [] };
                                                acc[date].data.push(item);
                                                return acc;
                                            }, {})
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderSectionHeader={({ section: { title } }) => (
                                            <View style={{ backgroundColor: "#EDF1F3", padding: 10 }}>
                                                <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR }}>
                                                    {title}
                                                </MyText>
                                            </View>
                                        )}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                style={{
                                                    padding: 10,
                                                    flexDirection: "row",
                                                    justifyContent: 'space-between',
                                                    borderBottomWidth: 0.5,
                                                    borderColor: COLORS?.LIGHT_COLOR,
                                                    alignItems: "center",
                                                    paddingBottom: 10
                                                }}
                                            >
                                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                    <View style={{ width: "90%" }}>
                                                        <MyText style={{ marginTop: 5, color: COLORS?.BLACK_COLOR, fontWeight: "bold" }}>
                                                            {item?.userFullName}
                                                        </MyText>
                                                        <MyText style={{ marginTop: 5, color: COLORS?.GREY_COLOR }}>
                                                            {item?.message}
                                                        </MyText>
                                                        <MyText style={{ marginTop: 5, color: COLORS?.GREY_COLOR }}>
                                                            {moment(item?.createdOn).format("hh:mm A")}
                                                        </MyText>
                                                    </View>
                                                </View>
                                                <TouchableOpacity>
                                                    <AntDesign name="right" size={15} color={COLORS?.LIGHT_COLOR} />
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </ContentContainer>
                                {/* <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Timeline</MyText>
                                <ContentContainer>
                                    <FlatList
                                        showsVerticalScrollIndicator={false}
                                        data={timeLineData}
                                        ListHeaderComponent={({ item, index: i }) => <MyText style={{ marginTop: 10, fontWeight: "500", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{moment(item?.createdOn).format("DD-MM-YYYY")}</MyText>}
                                        renderItem={({ item, index: i }) => (
                                            <>
                                                <TouchableOpacity style={{ flexDirection: "row", justifyContent: 'space-between', borderBottomWidth: i === (timeLineData?.length - 1) ? 0 : 0.5, borderColor: COLORS?.LIGHT_COLOR, alignItems: "center", paddingBottom: 10 }}>
                                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>

                                                        <View style={{ width: "90%" }}>
                                                            <MyText style={{ marginTop: 5, color: COLORS?.BLACK_COLOR, fontWeight: "bold" }}>{item?.userFullName}</MyText>
                                                            <MyText style={{ marginTop: 5, color: COLORS?.GREY_COLOR }}>{item?.message}</MyText>
                                                            <MyText style={{ marginTop: 5, color: COLORS?.GREY_COLOR }}>{moment(item?.createdOn).format("hh:mm a")}</MyText>
                                                        </View>
                                                    </View>
                                                    <TouchableOpacity >
                                                        <AntDesign name="right" size={15} color={COLORS?.LIGHT_COLOR} />
                                                    </TouchableOpacity>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    />
                                </ContentContainer> */}

                                <MyText style={{ marginTop: 20, fontWeight: "bold" }}>Parties</MyText>
                                <ContentContainer style={{ padding: 0 }}>

                                    {

                                        partiesData?.matterPartyDTOList?.map((item, index) => {

                                            return (
                                                <>
                                                    <View style={{ padding: 10, borderBottomWidth: partiesData?.matterPartyDTOList?.length - 1 === index ? 0 : 0.5, borderColor: COLORS?.BLACK_COLOR, }}>
                                                        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                            <MyText>Party Name</MyText>
                                                            <MyText style={{ fontWeight: "bold", color: COLORS?.PRIMARY_COLOR_LIGHT }}>{item?.name}</MyText>
                                                        </View>
                                                        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                            <MyText>Relationship</MyText>
                                                            <MyText style={{ fontWeight: "400", color: COLORS?.BLACK_COLOR, fontSize: calculatefontSize(1.5) }}>{item?.relationship}</MyText>
                                                        </View>
                                                        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                            <MyText>Address</MyText>
                                                            <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{item?.address || "-"}</MyText>
                                                        </View>
                                                        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                            <MyText>Phone</MyText>
                                                            <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{item?.phone || "-"}</MyText>
                                                        </View>

                                                        <View style={{ borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10 }}>
                                                            <MyText>Email</MyText>
                                                            <MyText style={{ fontWeight: "500", color: COLORS?.BLACK_COLOR, }}>{item?.email || "-"}</MyText>
                                                        </View>
                                                    </View>
                                                </>
                                            )
                                        })
                                    }



                                </ContentContainer>
                                <View style={{ justifyContent: "center", alignItems: "center", marginVertical: 30 }}>
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

    listContainer: {

        paddingVertical: 5,
    },
    itemContainer: {
        alignItems: 'center',
        width: tabSize + 20, // icon width + space for text
    },
    tab: {
        height: tabSize,
        width: tabSize,
        borderWidth: 1,
        borderColor: COLORS?.BORDER_LIGHT_COLOR,
        borderRadius: 12,
        marginHorizontal: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS?.whiteColors || '#fff',
        elevation: 2, // shadow Android
        shadowColor: '#000', // shadow iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    icon: {
        width: tabSize * 0.5,
        height: tabSize * 0.5,
        resizeMode: "contain",
    },
    tabText: {
        marginTop: 5,
        textAlign: 'center',
        fontWeight: '500',
        color: COLORS?.BLACK_COLOR,
        fontSize: width * 0.032, // responsive font size
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
