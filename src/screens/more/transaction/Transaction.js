import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    StyleSheet, Image,
    ScrollView
} from 'react-native';
import ScreenHeader from '../../../components/ScreenHeader';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import LinearGradient from 'react-native-linear-gradient';
import httpRequest from '../../../api/apiHandler';
import moment from 'moment';
import LoaderModal from '../../../components/LoaderModal';
import { Swipeable } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FloatingButton from '../../../components/FloatingButton';
import TimekeeperModal from '../../../components/TimekeeperModal';

const TOP_TABS = ['Funds', 'Receive Advance', 'Transfer Advance'];
// const SUB_TABS = ['All', 'Pending', 'Partial Received', 'Received', 'Cancelled'];

const SUB_TABS = [
    { id: 1, name: 'All', value: 'ALL' },
    { id: 2, name: 'Pending', value: 'PENDING' },
    { id: 3, name: 'Received', value: 'RECEIVED' },
    { id: 4, name: 'Partially Received', value: 'PARTIAL_RECEIVED' },
    { id: 4, name: 'Partially Released', value: 'PARTIAL_RELEASED' },
    { id: 4, name: 'Cancelled', value: 'CANCELLED' }
];
const TransactionsScreen = ({ navigation }) => {
    const [topTab, setTopTab] = useState('Funds');
    const [subTab, setSubTab] = useState('All');
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);


    const getData = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: 'get',
            path: topTab === 'Funds' ? `/ic/matter/client-fund/` : topTab == "Receive Advance" ? `/ic/payment/advance` : `/ic/payment/transfer-advance`,
            navigation
        })
        if (res) {
            setLoader(false)

            console.log(res, "HEKEKKEKE============dd====>");

            setData(res?.data)
        }
        else {
            setData([]);
            setLoader(false)
            console.log("err", err);
        }
    };

    useEffect(() => {
        getData();
    }, [topTab]);

    const filteredData = data.filter(item => {
        const matchStatus = subTab === 'All' || item?.status === subTab?.toLocaleUpperCase();
        const matchSearch = item?.code?.toLowerCase()?.includes(search?.toLowerCase());
        return matchStatus && matchSearch;
    });

    const deletItem = async (item) => {
        console.log(item, "ITEM==========>");

        const { res, err } = await httpRequest({
            method: 'delete',
            path: `/ic/matter/client-fund/`,
            params: [item?.matterClientFundId],
            navigation: navigation
        })
        if (res) {
            getData();
        }
        else {
            console.log("err", err);
        }
    }


    const renderLeftActions = (item) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate("EditTransaction", { transactionDetails: item })} style={styles.leftSwipe}>
                <AntDesign name="edit" size={20} color={COLORS?.BLACK_COLOR} />
            </TouchableOpacity>
        );
    };
    const renderRightActions = (item) => {
        return (
            <TouchableOpacity onPress={() => deletItem(item)} style={[styles.leftSwipe, { backgroundColor: COLORS?.RED_COLOR }]}>
                <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }) => (
        <Swipeable renderRightActions={() => renderRightActions(item)} overshootRight={false} overshootLeft={false} renderLeftActions={() => renderLeftActions(item)}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <TouchableOpacity>
                        <Text style={styles.codeText}>{item.code}</Text>
                    </TouchableOpacity>
                    <Text style={styles.balance}>{item.amount}</Text>
                </View>
                <MyText style={styles.mainText}>{item.matterName}</MyText>
                <MyText style={styles.subText}>{item.clientIds}</MyText>
                <View style={styles.dateRow}>
                    <Text style={styles.dateText}>{moment(item.issueDate).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.dueText}>{item.due}</Text>
                </View>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
        </Swipeable>
    );
    const renderItem1 = ({ item }) => {
        console.log(item, "====>RECEVIE ADVANCE");

        return (
            <>

                <View style={[styles.card]}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity>
                            <Text style={styles.codeText}>{item.entityType}</Text>
                        </TouchableOpacity>
                        <Text style={styles.balance}>{item.amount?.toFixed(2)}</Text>
                    </View>
                    {item?.notes && <MyText style={styles.mainText}>{item.notes}</MyText>}
                    <MyText style={styles.subText}>{item.matterId}</MyText>
                    <View style={styles.dateRow}>
                        <Text style={styles.dateText}>{moment(item.createdOn).format('DD/MM/YYYY')}</Text>
                        <Text style={styles.dueText}>{item.due}</Text>
                    </View>
                </View>
            </>

        )
    };
    const renderItem2 = ({ item }) => {
        return (

            <View style={[styles.card,]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity>
                        <Text style={styles.codeText}>{item.entityType}</Text>
                    </TouchableOpacity>
                    <Text style={styles.balance}>{item.amount?.toFixed(2)}</Text>
                </View>
                <MyText style={styles.mainText}>{item.notes}</MyText>
                <MyText style={styles.subText}>{item.matterId}</MyText>
                <View style={styles.dateRow}>
                    <Text style={styles.dateText}>{moment(item.createdOn).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.dueText}>{item.due}</Text>
                </View>
            </View>

        )
    }



    return (
        <>
            <ScreenHeader
                isGoBack={true}
                isShowTitle={true}
                title="Transactions"
                onPress={() => navigation.goBack()}
            />
            {/* <Wrapper> */}
            {/* 🔝 Top Tabs */}
            <View style={styles.topTabContainer}>
                {TOP_TABS.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => {
                            setTopTab(tab);
                            setSubTab('All');
                        }}
                        style={[
                            styles.topTab,
                            topTab === tab && styles.activeTopTab
                        ]}
                    >
                        <Text style={[
                            styles.topTabText,
                            topTab === tab && styles.activeTopTabText
                        ]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* 🔻 Sub Tabs */}
            {topTab === 'Funds' && (
                <LinearGradient
                    colors={[COLORS?.whiteColors, COLORS?.whiteColors,]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.tabContainer}
                >
                    <ScrollView showsHorizontalScrollIndicator={false} style={{ flex: 1, padding: 10, }} horizontal>
                        {SUB_TABS?.map((item) => (

                            <TouchableOpacity
                                key={item?.id}
                                style={[
                                    styles.tab,
                                    {
                                        paddingVertical: 5,
                                        borderRadius: 5,
                                        paddingHorizontal: 30,
                                        borderColor: subTab === item?.value ? COLORS.PRIMARY_COLOR_LIGHT : "transparent",
                                        backgroundColor:
                                            subTab === item?.value ? COLORS.PRIMARY_COLOR : COLORS.whiteColors,
                                    },
                                ]}
                                onPress={() => setSubTab(item?.value)}
                            >

                                <MyText style={{ color: subTab === item ? COLORS?.whiteColors : COLORS?.PRIMARY_COLOR, fontSize: calculatefontSize(2) }}>{item?.name}</MyText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </LinearGradient>
            )}

            {/* 🔍 Search */}
            {/* {topTab === 'Funds' && ( */}
            <View style={{ backgroundColor: COLORS?.whiteColors, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
                <View style={{ backgroundColor: COLORS?.whiteColors, width: "85%", alignItems: "center", top: 5 }}>
                    <SearchBar

                        placeholder="Search by code..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <TouchableOpacity onPress={() => {
                    if (topTab === 'Funds') {
                        navigation.navigate('CreateTransaction');
                    } else if (topTab === 'Receive Advance') {
                        navigation.navigate('CreateReceiveAdvance');
                    } else {
                        navigation.navigate('CreateTransferAdvance');

                    }
                }} style={{ padding: 5, backgroundColor: COLORS?.PRIMARY_COLOR, borderRadius: 5 }}>
                    <MyText style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.9) }}>New</MyText>
                </TouchableOpacity>
            </View>
            {/* )} */}
            <LoaderModal visible={loader} />
            {/* 📋 Content */}
            {topTab === 'Funds' && (

                <>
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS?.whiteColors, flex: 1 }}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 50 }}>No Funds found.</Text>
                        }
                    />
                </>
            )
            }
            {topTab === 'Receive Advance' && (

                <>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem1}
                        contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS?.whiteColors, flex: 1 }}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 50 }}>No Receive Advance found.</Text>
                        }
                    />
                </>
            )
            }
            {topTab === 'Transfer Advance' && (


                <>

                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem2}
                        contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS?.whiteColors, flex: 1 }}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 50 }}>No Transfer Advance found.</Text>
                        }
                    />
                </>
            )
            }

            <FloatingButton
                style={{ marginBottom: 40 }}
                onPress={() => setModalVisible(true)}
                icon="plus"
                navigateTo="CreateScreen"
                backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
                size={50}
                iconSize={25}
            />
            <TimekeeperModal navigation={navigation} visible={modalVisible} onClose={() => setModalVisible(false)} />

            {/* </Wrapper> */}
        </>
    );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
    topTabContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        // paddingVertical: 10,
        backgroundColor: '#fffcfcff',
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    topTab: {
        // paddingVertical: 6,
        paddingHorizontal: 25,
        padding: 20,
        // borderRadius: 20,
    },
    activeTopTab: {
        backgroundColor: COLORS.PRIMARY_COLOR,
    },
    topTabText: {
        color: '#444',
        fontSize: calculatefontSize(1.6),
    },
    activeTopTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    subTabContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
        justifyContent: 'center',
        paddingHorizontal: 10
    },
    subTab: {
        padding: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#eee',
        margin: 4,
    },
    activeSubTab: {
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT
    },
    subTabText: {
        fontSize: calculatefontSize(1.4),
        color: '#333'
    },
    activeSubTabText: {
        color: '#fff'
    },
    card: {
        backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
        padding: 15,
        marginVertical: 6,
        borderRadius: 8,
        elevation: 1,
        shadowColor: '#ccc',
        marginHorizontal: 10
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    codeText: {
        color: COLORS.PRIMARY_COLOR,
        fontWeight: '600',
        fontSize: calculatefontSize(1.8)
    },
    balance: {
        fontWeight: 'bold',
        color: COLORS.BLACK_COLOR
    },
    mainText: {
        fontSize: calculatefontSize(1.7),
        fontWeight: '500',
        marginTop: 4
    },
    subText: {
        color: '#555',
        fontSize: calculatefontSize(1.5),
        marginBottom: 6
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateText: {
        fontSize: calculatefontSize(1.3),
        color: '#444'
    },
    dueText: {
        fontSize: calculatefontSize(1.3),
        color: 'red'
    },
    statusBadge: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#facc15',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6
    },
    statusText: {
        color: '#000',
        fontSize: calculatefontSize(1.3),
    },

    //
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
        // padding: 10,
    },
    leftSwipe: {
        backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
        justifyContent: 'center',

        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginVertical: 6,
        // borderRadius: 8,
        // flex: 1,
    },
    leftSwipeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: calculatefontSize(1.6),
    },
    tab: {
        // paddingHorizontal: 10,
        // padding: 10
        // backgroundColor: COLORS.whiteColors,
        // flex: 1,
        // flexDirection: "row",
        // justifyContent: "center",

        // paddingVertical: 10,
        // alignItems: 'center',
        // borderRadius: 5,
        // marginHorizontal: 5,
    },
});
