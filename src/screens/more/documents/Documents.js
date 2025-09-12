// import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// //Icons
// import Entypo from "react-native-vector-icons/Entypo";
// import AntDesign from "react-native-vector-icons/AntDesign";
// import moment from 'moment';
// import LinearGradient from 'react-native-linear-gradient';
// import { Swipeable } from 'react-native-gesture-handler';
// import { useToast } from 'react-native-toast-notifications';


// import Wrapper from '../../../components/Wrapper';
// import TimekeeperModal from '../../../components/TimekeeperModal';
// import SearchBar from '../../../components/SearchBar';
// import FloatingButton from '../../../components/FloatingButton';
// import httpRequest from '../../../api/apiHandler';
// import Loader from '../../../components/Loader';
// import { formatNumber } from '../../../helper/Helpers';
// import ScreenHeader from '../../../components/ScreenHeader';
// import { COLORS, IconUri } from '../../../constants';
// import { calculatefontSize } from '../../../helper/responsiveHelper';
// import MyText from '../../../components/MyText';



// const Documents = ({ navigation, route }) => {
//     const matterDetails = route?.params?.matterDetails
//     const [tabs, setTabs] = React.useState("Documents");
//     const [activityData, setActivityData] = React.useState([]);
//     const [filteredData, setFilteredData] = React.useState([]);
//     const [searchText, setSearchText] = useState(''); // ✅ for search
//     const [loader, setLoader] = React.useState(false);
//     const [modalVisible, setModalVisible] = useState(false);

//     const toast = useToast();

//     console.log(matterDetails, "==========d============>matterDetails");


//     const getActivityData = async () => {
//         setLoader(true)
//         const { res, err } = await httpRequest({
//             method: 'get',
//             navigation: navigation,
//             path: tabs === "Documents" ? `/ic/matter/attachment/folder/0` : `/ic/matter/exp-entry/`
//         })
//         if (res) {
//             console.log(res, "====>");
//             setFilteredData(res?.data);
//             setActivityData(res?.data);
//             setLoader(false)
//         }
//         else {

//             setActivityData([]);
//             console.log("err", err);
//             setLoader(false)

//         }
//     }


//     useEffect(() => {
//         getActivityData();
//     }, [tabs])
//     useEffect(() => {
//         if (searchText === '') {
//             setFilteredData(activityData);
//         } else {
//             const filtered = activityData.filter(item =>
//                 (item?.name)
//                     .toLowerCase()
//                     .includes(searchText.toLowerCase())
//             );
//             setFilteredData(filtered);
//         }
//     }, [searchText, activityData]);



//     const renderActivityItem = ({ item }) => {
//         const isBilled = item?.billed;
//         const entryType = item?.type;
//         const amount = formatNumber(item?.amount);
//         const duration = item?.duration;

//         return (

//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 style={styles.card}
//             >
//                 {/* Left content */}
//                 <View style={styles.cardLeft}>
//                     <MyText style={styles.dateText}>{moment(item?.entryDate).format("DD-MM-YYYY")}</MyText>
//                     <MyText style={styles.titleText} numberOfLines={1}>{item?.name}</MyText>
//                     <MyText style={styles.entryType}>{item?.matterName}</MyText>
//                     {!!item?.description && (
//                         <MyText style={styles.descText} numberOfLines={2}>{item?.categoryName}</MyText>
//                     )}
//                 </View>

//                 {/* Right content */}
//                 <View style={styles.cardRight}>
//                     <MyText style={styles.amountText}>{moment(item?.receivedDate).format("DD-MM-YYYY")} {moment(item?.receivedTime).format("hh:mm A")}</MyText>
//                     {<MyText style={styles.durationText}>{duration}</MyText>}
//                     <View style={[
//                         styles.statusBox,
//                         { backgroundColor: isBilled ? "#22C55E" : "#ffc2cd" }
//                     ]}>
//                         <MyText style={[
//                             styles.statusText,
//                             { color: isBilled ? COLORS?.whiteColors : "#6c0014" }
//                         ]}>
//                             {isBilled ? "Billed" : "Unbilled"}
//                         </MyText>
//                     </View>
//                 </View>
//             </TouchableOpacity>

//         );
//     };
//     return (
//         <>

//             <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Documents' />
//             <LinearGradient
//                 colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//                 style={styles.tabContainer}

//             >
//                 {/* <View > */}
//                 {["Documents", "Office365"].map((item) => (

//                     <TouchableOpacity
//                         key={item}
//                         style={[
//                             styles.tab,
//                             {
//                                 borderBottomWidth: tabs === item ? 3 : 0,
//                                 borderColor: tabs === item ? COLORS.PRIMARY_COLOR_LIGHT : "transparent",
//                                 backgroundColor:
//                                     tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR,
//                             },
//                         ]}
//                         onPress={() => setTabs(item)}
//                     >
//                         {/* {tabs === item && <Image source={IconUri?.checkmark} style={{ height: 20, width: 20, resizeMode: "contain", right: 10 }} />} */}
//                         <MyText style={{ color: tabs === item ? COLORS?.BLACK_COLOR : COLORS?.whiteColors, fontSize: calculatefontSize(2) }}>{item}</MyText>
//                     </TouchableOpacity>
//                 ))}
//                 {/* </View> */}
//             </LinearGradient>
//             <Wrapper style={{ padding: 0 }}>
//                 <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
//                     <SearchBar
//                         containerStyle={{ width: "90%" }}

//                         placeholder="Search a task"
//                         value={searchText}
//                         onChangeText={text => setSearchText(text)}
//                     />
//                     <Image
//                         source={IconUri?.Calender}
//                         style={{ height: 30, width: 30, resizeMode: "contain" }}
//                     />
//                 </View>
//                 {/* ///RENDER ITEM =====================> */}
//                 {loader ? <Loader /> :

//                     filteredData?.length > 0 ?
//                         <FlatList
//                             // style={{ padding: 10 }}
//                             showsVerticalScrollIndicator={false}
//                             data={filteredData}
//                             keyExtractor={(item, index) => index.toString()}
//                             renderItem={renderActivityItem}

//                             ListFooterComponent={() => <View style={{ height: 100 }} />}
//                         />
//                         :
//                         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
//                             <Image source={IconUri?.Activitie} style={{ height: 30, width: 30, resizeMode: "contain" }} />
//                             <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
//                         </View>
//                 }
//                 {/* Floating Button */}
//                 <FloatingButton
//                     style={{ marginBottom: 40 }}
//                     onPress={() => setModalVisible(true)}
//                     icon="plus"
//                     navigateTo="CreateScreen"
//                     backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
//                     size={50}
//                     iconSize={25}
//                 />
//                 <TimekeeperModal navigation={navigation} visible={modalVisible} onClose={() => setModalVisible(false)} />
//             </Wrapper>
//         </>
//     )
// }

// export default Documents

// const styles = StyleSheet.create({
//     tabContainer: {
//         flexDirection: 'row',
//         backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
//         // padding: 10,
//     },
//     tab: {
//         flex: 1,
//         flexDirection: "row",
//         justifyContent: "center",

//         paddingVertical: 10,
//         alignItems: 'center',
//         borderRadius: 5,
//         marginHorizontal: 5,
//     },
//     //FLAT ITEM
//     timeColor: {
//         color: COLORS?.LIGHT_COLOR,
//         fontSize: calculatefontSize(1.5),
//     },
//     txtStyle: {
//         color: COLORS?.BLACK_COLOR,
//         fontSize: calculatefontSize(1.9),
//         fontWeight: '300',
//     },
//     taskText: {
//         fontSize: 18,
//         color: COLORS.PRIMARY_COLOR,
//         textAlign: 'center',
//         marginTop: 20,
//     },
//     // =============>
//     card: {
//         backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
//         marginVertical: 6,
//         marginHorizontal: 10,
//         borderRadius: 10,
//         padding: 15,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         elevation: 1,
//         shadowColor: '#ccc',
//     },
//     cardLeft: {
//         width: '65%',
//         gap: 5,
//     },
//     cardRight: {
//         width: '35%',
//         alignItems: 'flex-end',
//         gap: 5,
//         paddingHorizontal: 5,
//     },
//     dateText: {
//         color: COLORS?.LIGHT_COLOR,
//         fontSize: calculatefontSize(1.5),
//     },
//     titleText: {
//         color: COLORS?.BLACK_COLOR,
//         fontSize: calculatefontSize(1.8),
//         fontWeight: '500',
//     },
//     entryType: {
//         color: COLORS?.GREY_COLOR,
//         fontSize: calculatefontSize(1.5),
//     },
//     descText: {
//         color: COLORS?.GREY_COLOR,
//         fontSize: calculatefontSize(1.4),
//     },
//     amountText: {
//         fontWeight: '600',
//         fontSize: calculatefontSize(1.6),
//     },
//     durationText: {
//         fontSize: calculatefontSize(1.5),
//     },
//     statusBox: {
//         marginTop: 4,
//         borderRadius: 6,
//         paddingVertical: 2,
//         paddingHorizontal: 10,
//     },
//     statusText: {
//         fontWeight: '500',
//         fontSize: calculatefontSize(1.4),
//     },

// })

import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import Loader from '../../../components/Loader';
import ScreenHeader from '../../../components/ScreenHeader';
import { COLORS, fontFamily, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import { addDocument } from '../../../store/slices/taskSlice/createItemforDocuments';

const Documents = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails;
    const dispatch = useDispatch();

    const [tabs, setTabs] = React.useState('Documents');
    const [documentData, setDocumentData] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [searchText, setSearchText] = useState('');
    const [loader, setLoader] = React.useState(false);

    const getDocuments = async () => {
        setLoader(true);
        const { res, err } = await httpRequest({
            method: 'get',
            navigation: navigation,
            path:
                tabs === 'Documents'
                    ? `/ic/matter/attachment/folder/${matterDetails?.matterId || 0}`
                    : `/ic/matter/exp-entry/`,
        });
        if (res) {
            setFilteredData(res?.data || []);
            setDocumentData(res?.data || []);
            setLoader(false);
        } else {
            setDocumentData([]);
            console.log('err', err);
            setLoader(false);
        }
    };

    useEffect(() => {
        getDocuments();
    }, [tabs]);

    useEffect(() => {
        if (searchText === '') {
            setFilteredData(documentData);
        } else {
            const filtered = documentData.filter((item) =>
                (item?.name || '')
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText, documentData]);

    // folder/file icon
    const checkTypeForIcon = (type) => {
        console.log(type, 'type');

        if (type == "folder") {
            return (
                <Image
                    source={IconUri?.folder}
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                />
            );
        }
        else if (type == "image/jpeg") {
            return (
                <Image
                    source={IconUri?.imageType}
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                />
            );
        }

        else {
            return (
                <Image
                    source={IconUri?.word}
                    style={{ height: 20, width: 20, resizeMode: 'contain' }}
                />
            );
        }
    };

    const renderDocItem = ({ item }) => {
        console.log(item, 'item');

        return (
            <TouchableOpacity
                onPress={() => {
                    if (item?.folder) {
                        navigation.navigate('TaskFiles', { indexValue: item?.templateId });
                    } else {
                        navigation.navigate("DocumentViewerScreen", {
                            matterAttachmentId: item?.matterAttachmentId,
                            matterId: item?.matterId,
                            mimeType: item?.mimeType,
                            name: item?.name,
                        });
                    }
                }}
                style={styles.card}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    {checkTypeForIcon(item?.mimeType)}
                    <MyText style={styles.titleText}>{item?.name}</MyText>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <ScreenHeader
                isGoBack={true}
                onPress={() => {
                    navigation.goBack();
                }}
                isShowTitle={true}
                title="Documents"
            />

            {/* 🔹 Tabs */}
            <LinearGradient
                colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.tabContainer}
            >
                {['Documents', 'Office365'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        style={[
                            styles.tab,
                            {
                                borderBottomWidth: tabs === item ? 3 : 0,
                                borderColor:
                                    tabs === item ? COLORS.PRIMARY_COLOR_LIGHT : 'transparent',
                                backgroundColor:
                                    tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR,
                            },
                        ]}
                        onPress={() => setTabs(item)}
                    >
                        <MyText
                            style={{
                                color:
                                    tabs === item ? COLORS?.BLACK_COLOR : COLORS?.whiteColors,
                                fontSize: calculatefontSize(2),
                            }}
                        >
                            {item}
                        </MyText>
                    </TouchableOpacity>
                ))}
            </LinearGradient>

            <Wrapper style={{ padding: 0 }}>
                {/* 🔹 Search */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 10,
                    }}
                >
                    <SearchBar
                        containerStyle={{ width: '90%' }}
                        placeholder="Search document"
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                    />
                    <Image
                        source={IconUri?.Calender}
                        style={{ height: 30, width: 30, resizeMode: 'contain' }}
                    />
                </View>

                {/* 🔹 List */}
                {loader ? (
                    <Loader />
                ) : filteredData?.length > 0 ? (
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item, index) =>
                            item?.id?.toString() || index.toString()
                        }
                        renderItem={renderDocItem}
                        ListFooterComponent={() => <View style={{ height: 100 }} />}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: 10,
                        }}
                    >
                        <Image
                            source={IconUri?.Activitie}
                            style={{ height: 30, width: 30, resizeMode: 'contain' }}
                        />
                        <MyText
                            style={{
                                fontSize: calculatefontSize(1.5),
                                color: COLORS.PRIMARY_COLOR,
                            }}
                        >
                            No Data Found
                        </MyText>
                    </View>
                )}

                {/* 🔹 Floating Button */}
                <FloatingButton
                    style={{ marginBottom: 40 }}
                    onPress={() => console.log('Add new doc')}
                    icon="plus"
                    backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
                    size={50}
                    iconSize={25}
                />
            </Wrapper>
        </>
    );
};

export default Documents;

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginHorizontal: 5,
    },
    card: {
        // backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
        // marginVertical: 6,
        // marginHorizontal: 10,
        // borderRadius: 10,
        borderBottomWidth: 1,
        borderColor: COLORS?.BORDER_LIGHT_COLOR,
        padding: 10,
        marginHorizontal: 10
    },
    titleText: {
        color: COLORS?.BLACK_COLOR,
        fontSize: calculatefontSize(1.8),
        fontFamily: fontFamily.regulaer
    },
});
