import {
    FlatList,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

// Icons
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import moment from 'moment';
import TimekeeperModal from '../../../components/TimekeeperModal';

const Matters = ({ navigation }) => {
    const [tabs, setTabs] = React.useState('All');
    const [modalVisible, setModalVisible] = useState(false);

    const tabList = ['All', 'Open', 'Pending', 'Closed',];

    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
    const [searchText, setSearchText] = useState(''); // ✅ for search
    const [filteredData, setFilteredData] = useState([]);
    const getMatters = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/listing`,
            navigation: navigation,
        })
        if (res) {
            setFilteredData(res?.data);
            setData(res?.data)
        }
        else {
            console.log("err", err);
        }
    }

    useEffect(() => {
        getMatters()
    }, [])

    // ✅ Search logic
    useEffect(() => {
        let filtered = [...data];

        // Filter based on tab
        if (tabs !== 'All') {
            filtered = filtered.filter(item => item.status?.toLowerCase() === tabs.toLowerCase());
        }

        // Filter based on search
        if (searchText !== '') {
            filtered = filtered.filter(item =>
                (item?.name + item?.code + item?.matterName)
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }

        setFilteredData(filtered);
    }, [searchText, data, tabs]);

    return (
        <>
            <ScreenHeader onPress={() => { navigation.navigate("Settings") }} isShowTitle={true} title="Matters" />

            {/* Scrollable Tabs */}
            <View style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={tabList}

                    renderItem={({ item, i }) => {
                        return (
                            <>
                                <TouchableOpacity
                                    key={item}
                                    style={[
                                        styles.tab,

                                        {
                                            opacity: tabs === item ? 1 : 0.5,
                                            backgroundColor:
                                                COLORS.PRIMARY_COLOR
                                        },
                                    ]}
                                    onPress={() => setTabs(item)}
                                >
                                    <MyText
                                        style={{

                                            color: '#fff',
                                            fontWeight:'600',
                                            fontSize: calculatefontSize(1.7),
                                        }}
                                        numberOfLines={1}
                                    >
                                        {item}
                                    </MyText>
                                </TouchableOpacity>
                            </>
                        )
                    }}
                />
            </View>
            <Wrapper>
                {/* Search Row */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <SearchBar
                        containerStyle={{ width: '90%' }}
                        placeholder="Search a task"
                        value={searchText}
                        onChangeText={text => setSearchText(text)}
                    />
                    <Image
                        source={IconUri?.CalenderSearch}
                        style={{height: 30, width: 30,  resizeMode: 'contain' }}
                    />
                </View>

                {/* Task List */}
                {filteredData?.length > 0 ? <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => navigation.navigate('MatterDetails', { matterData: item })}
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 10,
                                    borderBottomWidth: 1,
                                    paddingVertical: 15,
                                    borderColor: COLORS?.BORDER_LIGHT_COLOR,
                                }}
                            >
                                <View style={{ gap: 5, width: "65%" }}>
                                    <MyText style={styles.timeColor}>Open {moment(item?.openDate).format('DD-MM-YYYY')}</MyText>
                                    <MyText numberOfLines={2} ellipsizeMode={'tail'} style={[styles.txtStyle, { fontWeight: '300', }]}>
                                        {item?.name}
                                    </MyText>
                                    <MyText style={styles.timeColor}>{item?.clientNames}</MyText>
                                </View>
                                <View style={{ gap: 5, width: "35%", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 10, }}>

                                    <View
                                        style={{
                                            backgroundColor: item?.status == "Open" ? '#EFE4FF' : '#ffc2cd',
                                            borderWidth: 1,
                                            borderColor: item?.status == "COMPLETED" ? '#7C4EC9' : '#6c0014',
                                            // alignSelf: 'flex-end',
                                            borderRadius: 5,
                                            paddingHorizontal: 8,
                                            paddingVertical: 2,
                                        }}
                                    >
                                        <MyText
                                            style={{
                                                // fontWeight: '600',
                                                // textAlign: 'center',
                                                color: item?.status == "COMPLETED" ? COLORS?.whiteColors : '#6c0014',
                                                fontSize: calculatefontSize(1.4),
                                            }}
                                        >
                                            {item?.status}
                                        </MyText>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={getMatters} />
                    }
                />
                    :
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
                        <Image  source={IconUri?.task} style={{ height: 50, width: 50, resizeMode: "contain" }} />
                        <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
                    </View>
                }



                {/* Floating Button */}
                <FloatingButton
                onPress={() => setModalVisible(true)}
                    icon="plus"
                    navigateTo="CreateScreen"
                    backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
                    size={50}
                    iconSize={25}
                />
                <TimekeeperModal navigation={navigation} visible={modalVisible} onClose={() => setModalVisible(false)} />
            </Wrapper>
        </>
    );
};

export default Matters;

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
    },
    tab: {
        paddingVertical: 6,
        height: 30,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeColor: {
        color: COLORS?.GREY_COLOR,
        fontSize: calculatefontSize(1.5),
    },
    txtStyle: {
        color: COLORS?.BLACK_COLOR,
        fontSize: calculatefontSize(1.9),
        fontWeight: '300',
    },
});
