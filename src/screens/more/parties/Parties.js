import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient';

//Screens

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
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Swipeable } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';



const Parties = ({ navigation }) => {
    const [tabs, setTabs] = React.useState("Individual");
    const [partiesData, setpartiesData] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [searchText, setSearchText] = useState(''); // ✅ for search
    const [loader, setLoader] = React.useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const toast = useToast();


    const getPartiesData = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: 'get',
            navigation: navigation,
            path: `/ic/party/`
        })
        if (res) {
            console.log(res, "====>");
            setFilteredData(res?.data);
            setpartiesData(res?.data);
            setLoader(false)
        }
        else {

            setpartiesData([]);
            console.log("err", err);
            setLoader(false)

        }
    }


    useEffect(() => {
        getPartiesData();
    }, [tabs])
    useEffect(() => {
        if (partiesData.length > 0) {
            const filteredByType = partiesData.filter(item => item?.type === tabs);
            setFilteredData(filteredByType);
        }
    }, [tabs, partiesData]);

    useEffect(() => {
        if (tabs === 'All') {
            setFilteredData(partiesData);
        }
        else {
            let filtered = partiesData.filter(item => item?.type === tabs);
            if (searchText !== '') {
                filtered = filtered.filter(item => {
                    if (tabs === 'Individual') {
                        const fullName = `${item?.firstName || ''} ${item?.lastName || ''}`.toLowerCase();
                        return fullName.includes(searchText.toLowerCase());
                    } else if (tabs === 'Supplier') {
                        return (item?.companyName || '').toLowerCase().includes(searchText.toLowerCase());
                    }

                    return false;
                });
            }

            setFilteredData(filtered);
        }
    }, [searchText, tabs, partiesData]);

    const handleDeleteItem = async (item) => {
        console.log(item, "DEETE ITEM");

        const { res, err } = await httpRequest({
            method: 'delete',
            navigation: navigation,
            path: `/ic/party/`,
            params: [item?.partyId]
        })
        if (res) {
            toast.show('Parties deleted successfully', { type: 'success' })
            getPartiesData();
        }
        else {
            console.log("err", err);
        }
    }

    const renderLeftActions = (item) => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => navigation.navigate("EditParties", { partiesDetails: item })}
                style={{ backgroundColor: COLORS?.LIGHT_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
            >
                <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
            </TouchableOpacity>
        </View>
    );
    const renderRightActions = (item) => (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                onPress={() => handleDeleteItem(item)}
                style={{ backgroundColor: COLORS?.RED_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
            >
                <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
            </TouchableOpacity>
        </View>
    );
    return (
        <>

            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Parties' />
            <LinearGradient
                colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabContainer}
            >
                {/* <View > */}
                {["All", "Individual", "Supplier"].map((item) => (

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
                        value={searchText}
                        onChangeText={text => setSearchText(text)}
                    />
                    <Image
                        source={IconUri?.CalenderSearch}
                        style={{ height: 30, width: 30, resizeMode: "contain" }}
                    />
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
                                                    {item?.type === 'Supplier'
                                                        ? item?.companyName
                                                        : `${item?.firstName || ''} ${item?.lastName || ''}`}
                                                </MyText>
                                                {item?.description !== "" && <MyText style={styles.timeColor}>
                                                    {item?.partyEmailAddressDTOList[0]?.email}
                                                </MyText>}
                                            </View>
                                            <View style={{ gap: 5, width: "35%", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 10, }}>
                                                {/* <MyText style={[styles.timeColor, { fontWeight: "600", textAlign: "right" }]}>${formatNumber(item?.balance)}</MyText> */}
                                                <MyText style={[styles.txtStyle, { textAlign: "right" }]}>{item?.duration}</MyText>
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

export default Parties

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