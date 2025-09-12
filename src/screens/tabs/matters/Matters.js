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
import AntDesign from 'react-native-vector-icons/AntDesign';
import TimekeeperModal from '../../../components/TimekeeperModal';
import LinearGradient from 'react-native-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';
import Loader from '../../../components/Loader';
import { useToast } from 'react-native-toast-notifications';
import { useIsFocused } from '@react-navigation/native';

const Matters = ({ navigation }) => {
    const [tabs, setTabs] = React.useState('All');
    const toast = useToast()
    const [modalVisible, setModalVisible] = useState(false);

    const tabList = ['All', 'Open', 'Pending', 'Closed',];

    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
    const [searchText, setSearchText] = useState(''); // ✅ for search
    const [isLoader, setIsLoader] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const isFocused = useIsFocused()
    const getMatters = async () => {
        setIsLoader(true)
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/listing`,
            navigation: navigation,
        })
        if (res) {
            setIsLoader(false)

            setFilteredData(res?.data);
            setData(res?.data);
        }
        else {
            setIsLoader(false)
            console.log("err", err);
        }
    }

    useEffect(() => {
        getMatters()
    }, [isFocused])

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

        // Reverse the final filtered list
        setFilteredData(filtered.sort((a, b) => new Date(b.openDate) - new Date(a.openDate)));
        // setFilteredData(filtered.reverse());
    }, [searchText, data, tabs]);


    const deleteMatter = async (item) => {
        const { res, err } = await httpRequest({
            method: 'delete',
            path: `/ic/matter/`,
            navigation: navigation,
            params: [item?.matterId],
        })
        console.log(res, "===================>");

        if (res) {
            toast.show('Matter deleted successfully', { type: 'success' })
            getMatters()
        }
        else {
            console.log("err", err);
        }
    }


    const renderLeftActions = (item) => {
        console.log(item, "====================================>?");

        return (
            <View style={{ flexDirection: 'row', width: 200 }}> {/* <-- fixed width */}
                <TouchableOpacity onPress={() => navigation.navigate("EditMatter", { matterDetails: item })} style={styles.leftSwipe}>
                    <AntDesign name="edit" size={20} color={COLORS?.BLACK_COLOR} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMatter(item)} style={[styles.leftSwipe, { backgroundColor: COLORS?.RED_COLOR }]}>
                    <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
                </TouchableOpacity>

            </View>
        );
    };

    return (
        <>
            <ScreenHeader onPress={() => { navigation.navigate("Settings") }} isShowTitle={true} title="Matters" />

            {/* Scrollable Tabs */}
            <LinearGradient
                colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}

            >
                <View
                //  style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}
                >

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={tabList}

                        renderItem={({ item, i }) => {
                            return (
                                <>

                                    <TouchableOpacity
                                        key={i?.toString()}
                                        style={[
                                            styles.tab,

                                            {
                                                // opacity: tabs === item ? 1 : 0.5,
                                                backgroundColor:
                                                    tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR
                                            },
                                        ]}
                                        onPress={() => setTabs(item)}
                                    >
                                        <MyText
                                            style={{

                                                color: tabs === item ? COLORS?.BLACK_COLOR : '#fff',
                                                fontWeight: '600',
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
            </LinearGradient>
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
                        source={IconUri?.Calender}
                        style={{ height: 30, width: 30, resizeMode: 'contain', bottom: 7 }}
                    />
                </View>

                {/* Task List */}
                {
                    isLoader ? <Loader /> :
                        filteredData?.length > 0 ? <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredData}
                            // style={{ borderWidth: 1 }}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: 100 }}

                            renderItem={({ item, index }) => {
                                return (
                                    <Swipeable renderLeftActions={() => renderLeftActions(item)}>
                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('MatterDetails', { matterData: item })}
                                            style={{
                                                // marginHorizontal: 10,
                                                marginVertical: 5,
                                                padding: 15,
                                                borderColor: COLORS?.BORDER_LIGHT_COLOR,

                                                borderRadius: 10,
                                                backgroundColor: '#fff',
                                                borderWidth: 1,

                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {/* Left Section */}
                                            <View style={{ width: '65%', gap: 5 }}>
                                                <MyText style={{ color: COLORS.LIGHT_COLOR, fontSize: calculatefontSize(1.5) }}>
                                                    {item?.code} • {moment(item?.openDate).format('DD-MM-YYYY')}
                                                </MyText>
                                                <MyText
                                                    numberOfLines={2}
                                                    style={{ fontSize: calculatefontSize(2), color: COLORS.BLACK_COLOR, fontWeight: '500' }}
                                                >
                                                    {item?.name ? item?.name.toString() : ''}
                                                </MyText>
                                                {!!item?.clientNames && (
                                                    <MyText style={{ color: COLORS.GREY_COLOR, fontSize: calculatefontSize(1.5) }}>
                                                        {item?.clientNames}
                                                    </MyText>
                                                )}
                                            </View>

                                            {/* Right Section */}
                                            <View style={{ width: '35%', alignItems: 'flex-end', gap: 5 }}>
                                                <View
                                                    style={{
                                                        backgroundColor: item?.status === 'Open' ? '#EFE4FF' : '#ffc2cd',
                                                        borderColor: item?.status === 'Open' ? '#7C4EC9' : '#6c0014',
                                                        borderWidth: 1,
                                                        paddingHorizontal: 10,
                                                        paddingVertical: 4,
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <MyText
                                                        style={{
                                                            fontSize: calculatefontSize(1.4),
                                                            fontWeight: '600',
                                                            color: item?.status === 'Open' ? '#7C4EC9' : '#6c0014',
                                                        }}
                                                    >
                                                        {item?.status}
                                                    </MyText>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </Swipeable>
                                );
                            }}


                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={getMatters} />
                            }
                        />
                            :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
                                <Image source={IconUri?.task} style={{ height: 50, width: 50, resizeMode: "contain" }} />
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
    leftSwipe: {
        backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
        justifyContent: 'center',

        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginVertical: 6,
        // borderRadius: 8,
        // flex: 1,
    },
});
