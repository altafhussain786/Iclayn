import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
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
import { useFocusEffect } from '@react-navigation/native';



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

    useFocusEffect(
        useCallback(() => {
            getPartiesData();
        }, [tabs]) // tabs bhi dependency me rakho
    );
    // useEffect(() => {
    //     getPartiesData();
    // }, [tabs])
    useEffect(() => {
        if (partiesData.length > 0) {
            const filteredByType = partiesData.filter(item => item?.type === tabs);
            setFilteredData(filteredByType);
        }
    }, [tabs, partiesData]);

    useEffect(() => {
        let filtered = partiesData;

        if (tabs !== 'All') {
            filtered = filtered.filter(item => item?.type === tabs);
        }

        if (searchText !== '') {
            const lowerSearch = searchText.toLowerCase();

            filtered = filtered.filter(item => {
                if (item?.type === 'Individual') {
                    const fullName = `${item?.firstName || ''} ${item?.lastName || ''}`.toLowerCase();
                    return fullName.includes(lowerSearch);
                } else if (item?.type === 'Supplier') {
                    return (item?.companyName || '').toLowerCase().includes(lowerSearch);
                }

                return false;
            });
        }

        setFilteredData(filtered);
    }, [searchText, tabs, partiesData]);
    // useEffect(() => {
    //     if (tabs === 'All') {
    //         setFilteredData(partiesData);
    //     }
    //     else {
    //         let filtered = partiesData.filter(item => item?.type === tabs);
    //         if (searchText !== '') {
    //             filtered = filtered.filter(item => {
    //                 if (tabs === 'Individual') {
    //                     const fullName = `${item?.firstName || ''} ${item?.lastName || ''}`.toLowerCase();
    //                     return fullName.includes(searchText.toLowerCase());
    //                 } else if (tabs === 'Supplier') {
    //                     return (item?.companyName || '').toLowerCase().includes(searchText.toLowerCase());
    //                 }

    //                 return false;
    //             });
    //         }

    //         setFilteredData(filtered);
    //     }
    // }, [searchText, tabs, partiesData]);

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

    const renderPartyItem = ({ item }) => {
        const isSupplier = item?.type === 'Supplier';
        const name = isSupplier
            ? item?.companyName
            : `${item?.firstName || ''} ${item?.lastName || ''}`;

        return (
            <Swipeable
                renderLeftActions={() => renderLeftActions(item)}
                renderRightActions={() => renderRightActions(item)}
                overshootLeft={false}
                overshootRight={false}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.card}
                >
                    <View style={styles.cardLeft}>
                        <MyText style={[styles.partyType, { color: "gray" }]}>{item?.type}</MyText>
                        <MyText style={styles.partyName} numberOfLines={1}>
                            {name}
                        </MyText>
                        {!!item?.partyEmailAddressDTOList?.[0]?.email && (
                            <MyText style={styles.emailText}>
                                {item?.partyEmailAddressDTOList[0].email}
                            </MyText>
                        )}
                    </View>

                    <View style={styles.cardRight}>
                        {!!item?.duration && (
                            <MyText style={styles.durationText}>{item?.duration}</MyText>
                        )}
                        <View style={styles.statusBox}>
                            <MyText style={styles.statusText}>{item?.status}</MyText>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };


    const renderLeftActions = (item) => (
        <TouchableOpacity
            onPress={() => navigation.navigate("EditParties", { partiesDetails: item })}
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
            onPress={() => handleDeleteItem(item)}
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
    return (
        <>

            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Parties' />
            <LinearGradient
                colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.tabContainer]}
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
                                    tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR,
                            },
                        ]}
                        onPress={() => setTabs(item)}
                    >
                        {/* {tabs === item && <Image source={IconUri?.checkmark} style={{ height: 20, width: 20, resizeMode: "contain", right: 10 }} />} */}
                        <MyText style={{ color: tabs === item ? COLORS?.BLACK_COLOR : COLORS?.whiteColors, fontSize: calculatefontSize(2) }}>{item}</MyText>
                    </TouchableOpacity>
                ))}
                {/* </View> */}
            </LinearGradient>
            <Wrapper style={{ padding: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
                    <SearchBar
                        containerStyle={{ width: "90%" }}
                        placeholder="Search a parties..."
                        value={searchText}
                        onChangeText={text => setSearchText(text)}
                    />
                    <Image
                        source={IconUri?.Calender}
                        style={{ height: 30, width: 30, resizeMode: "contain", bottom: 7 }}
                    />
                </View>
                {/* ///RENDER ITEM =====================> */}
                {loader ? <Loader /> :

                    filteredData?.length > 0 ?
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={filteredData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderPartyItem}

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
    //
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
    partyType: {
        fontSize: calculatefontSize(1.5),
        color: COLORS?.LIGHT_COLOR,
    },
    partyName: {
        fontSize: calculatefontSize(1.8),
        fontWeight: '500',
        color: COLORS?.BLACK_COLOR,
    },
    emailText: {
        fontSize: calculatefontSize(1.4),
        color: COLORS?.GREY_COLOR,
    },
    durationText: {
        fontSize: calculatefontSize(1.5),
        fontWeight: '500',
    },
    statusBox: {
        backgroundColor: '#22C55E',
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

})