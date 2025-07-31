import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';

//Screens
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import Loader from '../../../components/Loader';
import TimekeeperModal from '../../../components/TimekeeperModal';
import ScreenHeader from '../../../components/ScreenHeader';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize, getResponsiveWidth } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import { Swipeable } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';



const Communications = ({ navigation }) => {
    const toast = useToast();
    const [tabs, setTabs] = React.useState("All");
    const [communicationData, setcommunicationData] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [searchText, setSearchText] = useState(''); // ✅ for search
    const [loader, setLoader] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isShowCreate, setIsShowCreate] = useState(false);


    const CreateItem = [
        {
            id: 1,
            name: 'Phone Log',
            image: IconUri?.Calender,
            screenName: "CreatePhoneLog",
            color: COLORS?.PRIMARY_COLOR_LIGHT
        },
        {
            id: 2,
            name: 'Internal Log',
            screenName: "CreateInternalLogs",
            image: IconUri?.All,
            color: COLORS?.PRIMARY_COLOR_LIGHT
        },

    ]

    const getCommunicationData = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/comm-log`,
            navigation: navigation,
        })
        console.log(res, "=========================d=============================>");
        if (res) {
            setFilteredData(res?.data);
            setcommunicationData(res?.data);
            setLoader(false)
        }
        else {

            setcommunicationData([]);
            console.log("err", err);
            setLoader(false)

        }
    }


    useEffect(() => {
        getCommunicationData();
    }, [tabs])
    useEffect(() => {
        if (communicationData.length > 0) {
            const filteredByType = communicationData.filter(item => item?.type === tabs);
            setFilteredData(filteredByType);
        }
    }, [tabs, communicationData]);

    const handleDeleteItems = async (item) => {
        console.log(item, "DELETE ITEM");

        const { res, err } = await httpRequest({
            method: 'delete',
            path: `/ic/matter/comm-log/`,
            navigation: navigation,
            params: [item?.matterComLogId]
        })
        if (res) {
            toast.show('Communication deleted successfully', { type: 'success' })
            getCommunicationData();
        }
        else {
            console.log("err=================", err);
        }
    }

    useEffect(() => {
        if (tabs === 'All') {
            setFilteredData(communicationData);
        }
        else {
            let filtered = communicationData.filter(item => item?.type === tabs);
            if (searchText !== '') {
                filtered = filtered.filter(item => {
                    if (tabs === 'Phone') {
                        const fullName = `${item?.subject}`.toLowerCase();
                        return fullName.includes(searchText.toLowerCase());
                    } else if (tabs === 'Internal') {
                        return (item?.subject || '').toLowerCase().includes(searchText.toLowerCase());
                    }
                    return false;
                });
            }

            setFilteredData(filtered);
        }
    }, [searchText, tabs, communicationData]);

    const renderLeftActions = (item) => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => navigation.navigate(item?.type === 'Phone' ? "EditPhoneLog" : "EditInternalLog", { communicationDetails: item })}
                style={{ backgroundColor: COLORS?.LIGHT_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
            >
                <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
            </TouchableOpacity>
        </View>
    );
    const renderRightActions = (item) => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => handleDeleteItems(item)}
                style={{ backgroundColor: COLORS?.RED_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
            >
                <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
            </TouchableOpacity>
        </View>
    );
    return (
        <>

            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Communications' />
            <LinearGradient
                colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabContainer}
            >
                {/* <View > */}
                {["All", "Phone", "Internal"].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.tab,
                            {
                                borderBottomWidth: tabs === item ? 3 : 0,
                                borderColor: tabs === item ? COLORS.PRIMARY_COLOR_LIGHT : "transparent",
                                backgroundColor:
                                    tabs === item ? COLORS.PRIMARY_COLOR : COLORS.PRIMARY_COLOR,
                            },
                        ]}
                        onPress={() => setTabs(item)}
                    >
                        {tabs === item && <Image source={IconUri?.checkmark} style={{ height: 20, width: 20, resizeMode: "contain", right: 10 }} />}
                        <MyText style={{ color: tabs === item ? COLORS?.whiteColors : COLORS?.whiteColors, fontSize: calculatefontSize(2) }}>{item}</MyText>
                    </TouchableOpacity>
                ))}
                {/* </View> */}
            </LinearGradient>
            <Wrapper>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <SearchBar
                        containerStyle={{ width: "90%" }}
                        placeholder="Search a parties..."
                        value={searchText} onChangeText={text => setSearchText(text)}
                    />
                    <View>
                        <TouchableOpacity onPress={() => setIsShowCreate(!isShowCreate)}>
                            <Image
                                source={IconUri?.hamBurger}
                                style={{ height: 30, width: 30, resizeMode: "contain", }}
                            />
                        </TouchableOpacity>
                        {isShowCreate && <View style={{ backgroundColor: COLORS?.whiteColors, padding: 10, position: "absolute", width: 100, top: 30, right: 10, borderWidth: 0.5, borderRadius: 5, zIndex: 1 }}>
                            {
                                CreateItem?.map((item, index) => {
                                    return (
                                        <>
                                            <TouchableOpacity onPress={() => { navigation.navigate(item?.screenName) }}>
                                                <MyText style={{ color: COLORS?.BLACK_COLOR, fontSize: calculatefontSize(1.8) }}>{item?.name}</MyText>
                                            </TouchableOpacity>
                                        </>
                                    )
                                })
                            }
                        </View>}
                    </View>
                </View>
                {/* ///RENDER ITEM =====================> */}
                {loader ? <Loader /> :

                    filteredData?.length > 0 ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, i }) => {
                                return (
                                    <Swipeable renderLeftActions={() => renderLeftActions(item)} renderRightActions={() => renderRightActions(item)}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 10,
                                                borderBottomWidth: 1,
                                                paddingVertical: 15,
                                                borderColor: COLORS?.BORDER_LIGHT_COLOR,
                                            }}
                                        >
                                            <View style={{ gap: 5, width: "65%", }}>
                                                <MyText style={styles.timeColor}>{item?.type}</MyText>
                                                <MyText style={[styles.txtStyle, { fontWeight: "300" }]}>
                                                    {item?.subject}
                                                </MyText>
                                                {item?.description !== "" && <MyText style={styles.timeColor}>
                                                    {item?.subject}
                                                </MyText>}
                                            </View>
                                            <View style={{ gap: 5, width: "35%", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 10, }}>
                                                {/* <MyText style={[styles.timeColor, { fontWeight: "600", textAlign: "right" }]}>${formatNumber(item?.balance)}</MyText> */}
                                                {item?.timer && <MyText style={[styles.txtStyle,]}>{item?.timer}</MyText>}
                                                <View style={{ backgroundColor: "#22C55E", alignSelf: "flex-end", width: getResponsiveWidth(20), borderRadius: 5, paddinHorizontal: 30 }}>
                                                    <MyText style={[styles.timeColor, { fontWeight: "300", textAlign: "center", color: COLORS?.whiteColors }]}>
                                                        {item?.status}
                                                    </MyText>
                                                </View>
                                            </View>
                                        </View>
                                    </Swipeable>
                                );
                            }}
                            ListFooterComponent={() => <View style={{ height: 100 }} />}
                        />
                        :
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
                            <Image source={IconUri?.Activitie} style={{ height: 30, width: 30, resizeMode: "contain" }} />
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
    )
}

export default Communications

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
        // padding: 10,
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
    //FLAT ITEM
    timeColor: {
        color: COLORS?.LIGHT_COLOR,
        fontSize: calculatefontSize(1.5),
    },
    txtStyle: {
        color: COLORS?.BLACK_COLOR,
        fontSize: calculatefontSize(1.9),
        fontWeight: '300',
    },
    taskText: {
        fontSize: 18,
        color: COLORS.PRIMARY_COLOR,
        textAlign: 'center',
        marginTop: 20,
    },
})