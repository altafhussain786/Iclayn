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

const TOP_TABS = ['Funds', 'Receive Advance', 'Transfer Advance'];
const SUB_TABS = ['All', 'Pending', 'Partial Received', 'Received', 'Cancelled'];

const TransactionsScreen = ({ navigation }) => {
    const [topTab, setTopTab] = useState('Funds');
    const [subTab, setSubTab] = useState('All');
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [loader, setLoader] = useState(false);

    const getData = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: 'get',
            path: topTab === 'Funds' ? `/ic/matter/client-fund/` : topTab == "Receive Advance" ? `/ic/payment/advance` : `/ic/payment/transfer-advance`,
            // path: `/ic/payment/advance`,
            navigation
        })
        if (res) {
            setLoader(false)

            console.log(res, "HEKEKKEKE============d====>");

            setData(res?.data)
        }
        else {
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

    const renderItem = ({ item }) => (
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
    );
    const renderItem1 = ({ item }) => (
        <View style={[styles.card, { flex: 1, }]}>
            <View style={styles.headerRow}>
                <TouchableOpacity>
                    <Text style={styles.codeText}>{item.paymentMethodName}</Text>
                </TouchableOpacity>
                <Text style={styles.balance}>{item.amount}</Text>
            </View>
            <MyText style={styles.mainText}>{item.entityType}</MyText>
            <MyText style={styles.subText}>{item.matterId}</MyText>
            <View style={styles.dateRow}>
                <Text style={styles.dateText}>{moment(item.issueDate).format('DD/MM/YYYY')}</Text>
                <Text style={styles.dueText}>{item.due}</Text>
            </View>

        </View>
    );

    return (
        <>
            <ScreenHeader
                isGoBack={true}
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
                                key={item}
                                style={[
                                    styles.tab,
                                    {
                                        paddingVertical: 5,
                                        borderRadius: 5,
                                        paddingHorizontal: 30,
                                        borderColor: subTab === item ? COLORS.PRIMARY_COLOR_LIGHT : "transparent",
                                        backgroundColor:
                                            subTab === item ? COLORS.PRIMARY_COLOR : COLORS.whiteColors,
                                    },
                                ]}
                                onPress={() => setSubTab(item)}
                            >

                                <MyText style={{ color: subTab === item ? COLORS?.whiteColors : COLORS?.PRIMARY_COLOR, fontSize: calculatefontSize(2) }}>{item}</MyText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </LinearGradient>
            )}

            {/* 🔍 Search */}
            {topTab === 'Funds' && (
                <SearchBar
                    placeholder="Search by code..."
                    value={search}
                    onChangeText={setSearch}
                />
            )}
            <LoaderModal visible={loader} />
            {/* 📋 Content */}
            {topTab === 'Funds' ? (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS?.whiteColors, flex: 1 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 50 }}>No transactions found.</Text>
                    }
                />
            )
                : topTab === 'Receive Advance' ? (
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem1}
                        contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS?.whiteColors, flex: 1 }}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 50 }}>No transactions found.</Text>
                        }
                    />
                )
                    : topTab === 'Transfer Advance' ? (
                        data.length > 0 ? (
                            <View
                                style={{ flex: 1, backgroundColor: COLORS?.whiteColors, justifyContent: "center", alignItems: "center" }}
                            >
                                <MyText>dkfhkdshfksd</MyText>
                            </View>
                        )
                            :
                            <FlatList
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                contentContainerStyle={{ paddingBottom: 100, backgroundColor: COLORS?.whiteColors, flex: 1 }}
                                ListEmptyComponent={
                                    <Text style={{ textAlign: 'center', marginTop: 50 }}>No transactions found.</Text>
                                }
                            />
                    )
                        : (
                            <View style={{ marginTop: 50, alignItems: 'center' }}>
                                <Text style={{ fontSize: calculatefontSize(1.6), color: COLORS.BLACK_COLOR }}>
                                    {topTab} screen coming soon...
                                </Text>
                            </View>
                        )}


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
