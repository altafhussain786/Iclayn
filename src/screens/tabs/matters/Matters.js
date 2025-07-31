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
            setData(res?.data)
        }
        else {
            setIsLoader(false)
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
                <TouchableOpacity
                    onPress={() => navigation.navigate("EditMatter", { matterDetails: item })}
                    style={{ backgroundColor: '#0068D1', justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
                >
                    <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
                    {/* <Text style={{ color: COLORS?.whiteColors, textAlign: 'center', fontWeight: "bold" }}>
                       Edit
                    </Text> */}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => deleteMatter(item)}
                    style={{ backgroundColor: COLORS?.RED_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
                >
                    <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
                    {/* <Text style={{ color: COLORS?.whiteColors, textAlign: 'center' }}>
                        Delete
                    </Text> */}
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
                        source={IconUri?.CalenderSearch}
                        style={{ height: 30, width: 30, resizeMode: 'contain' }}
                    />
                </View>

                {/* Task List */}
                {
                    isLoader ? <Loader /> :
                        filteredData?.length > 0 ? <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredData}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            renderItem={({ item, index }) => {
                                return (
                                    <Swipeable renderLeftActions={() => renderLeftActions(item)}>
                                        <TouchableOpacity onPress={() => navigation.navigate('MatterDetails', { matterData: item })}
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                paddingVertical: 15,
                                                paddingHorizontal: 10,
                                                borderBottomWidth: 1,
                                                borderColor: COLORS?.BORDER_LIGHT_COLOR,
                                                backgroundColor: '#fff',
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
});
