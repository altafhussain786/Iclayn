import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

// Components
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

    const tabList = ['All', 'Open', 'Pending', 'Closed'];

    const [data, setData] = useState([])
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
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

        if (tabs !== 'All') {
            filtered = filtered.filter(item => item.status?.toLowerCase() === tabs.toLowerCase());
        }

        if (searchText !== '') {
            filtered = filtered.filter(item =>
                (item?.name + item?.code + item?.matterName)
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
        }

        setFilteredData(filtered.sort((a, b) => new Date(b.openDate) - new Date(a.openDate)));
    }, [searchText, data, tabs]);


    const deleteMatter = async (item) => {
        const { res, err } = await httpRequest({
            method: 'delete',
            path: `/ic/matter/`,
            navigation: navigation,
            params: [item?.matterId],
        })

        if (res) {
            toast.show('Matter deleted successfully', { type: 'success' })
            getMatters()
        }
        else {
            console.log("err", err);
        }
    }


    const renderLeftActions = (item) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("EditMatter", { matterDetails: item })}
            style={{
                backgroundColor: COLORS?.LIGHT_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
                marginVertical: 6,
            }}
        >
            <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
        </TouchableOpacity>
    );

    const renderRightActions = (item) => (
        <TouchableOpacity
            onPress={() => deleteMatter(item)}
            style={{
                backgroundColor: COLORS?.RED_COLOR,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 20,
                marginVertical: 6,
            }}
        >
            <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
        </TouchableOpacity>
    );

    const renderMatterItem = ({ item }) => {
        return (
            <Swipeable
                renderLeftActions={() => renderLeftActions(item)}
                renderRightActions={() => renderRightActions(item)}
                overshootLeft={false}
                overshootRight={false}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate('MatterDetails', { matterData: item })}
                    activeOpacity={0.9}
                    style={styles.card}
                >
                    {/* Left */}
                    <View style={styles.cardLeft}>
                        <MyText style={styles.matterCode}>
                            {item?.code} • {moment(item?.openDate).format('DD-MM-YYYY')}
                        </MyText>
                        <MyText style={styles.matterName} numberOfLines={2}>
                            {item?.name}
                        </MyText>
                        {!!item?.clientNames && (
                            <MyText style={styles.clientText}>{item?.clientNames}</MyText>
                        )}
                    </View>

                    {/* Right */}
                    <View style={styles.cardRight}>
                        <View style={[
                            styles.statusBox,
                            {
                                backgroundColor:
                                    item?.status === 'Open' ? '#22C55E' :
                                        item?.status === 'Pending' ? '#FACC15' : '#EF4444',
                            }
                        ]}>
                            <MyText style={styles.statusText}>{item?.status}</MyText>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        )
    }

    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Matters" />

            {/* Tabs like Parties */}
            <LinearGradient
                colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabContainer}
            >
                {tabList.map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.tab,
                            {
                                borderBottomWidth: tabs === item ? 3 : 0,
                                borderColor: tabs === item ? COLORS.PRIMARY_COLOR_LIGHT : "transparent",
                                backgroundColor:
                                    tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR,
                            },
                        ]}
                        onPress={() => setTabs(item)}
                    >
                        <MyText style={{ color: tabs === item ? COLORS?.BLACK_COLOR : COLORS?.whiteColors, fontSize: calculatefontSize(2) }}>{item}</MyText>
                    </TouchableOpacity>
                ))}
            </LinearGradient>

            <Wrapper style={{ padding: 0 }}>
                {/* Search row */}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
                    <SearchBar
                        containerStyle={{ width: "90%" }}
                        placeholder="Search matters..."
                        value={searchText}
                        onChangeText={text => setSearchText(text)}
                    />
                    <Image
                        source={IconUri?.Calender}
                        style={{ height: 30, width: 30, resizeMode: "contain", bottom: 7 }}
                    />
                </View>

                {/* List */}
                {
                    isLoader ? <Loader /> :
                        filteredData?.length > 0 ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={filteredData}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderMatterItem}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getMatters} />}
                                ListFooterComponent={() => <View style={{ height: 100 }} />}
                            />
                            :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
                                <Image source={IconUri?.task} style={{ height: 40, width: 40, resizeMode: "contain" }} />
                                <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
                            </View>
                }

                {/* Floating Button */}
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
            </Wrapper>
        </>
    );
};

export default Matters;

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
    },
    tab: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    card: {
        backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
        marginVertical: 6,
        marginHorizontal: 10,
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#ccc',
    },
    cardLeft: {
        width: '65%',
        gap: 5,
    },
    cardRight: {
        width: '35%',
        alignItems: 'flex-end',
        gap: 5,
    },
    matterCode: {
        fontSize: calculatefontSize(1.5),
        color: COLORS?.LIGHT_COLOR,
    },
    matterName: {
        fontSize: calculatefontSize(1.8),
        fontWeight: '500',
        color: COLORS?.BLACK_COLOR,
    },
    clientText: {
        fontSize: calculatefontSize(1.4),
        color: COLORS?.GREY_COLOR,
    },
    statusBox: {
        borderRadius: 6,
        paddingVertical: 2,
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
    },
    statusText: {
        color: COLORS?.whiteColors,
        fontSize: calculatefontSize(1.3),
        fontWeight: '500',
    },
});
