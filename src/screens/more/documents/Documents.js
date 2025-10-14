
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
import { useDispatch } from 'react-redux';

import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import Loader from '../../../components/Loader';
import ScreenHeader from '../../../components/ScreenHeader';
import { API_URL, COLORS, fontFamily, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import { addDocument } from '../../../store/slices/taskSlice/createItemforDocuments';
import { checkTypeForIcon } from '../../../helper/Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Documents = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails;
    const dispatch = useDispatch();

    const [tabs, setTabs] = useState('Documents');
    const [documentData, setDocumentData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loader, setLoader] = useState(false);

    // new states @=====> 
    const [organizationData, setOrganizationData] = useState({});

    useEffect(() => {
        if (tabs === 'Documents') {
            getDocuments();
        } else {
            getOrgaanizationData(); // first fetch org data, then Office365 data
        }
    }, [tabs]);

    const getOrgaanizationData = async () => {
        setLoader(true);
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/organization/?orgCode=5024000001`,
            navigation: navigation
        });
        if (res) {
            console.log('get organization data', res?.data);

            setOrganizationData(res?.data);
            getOffice365Data(res?.data?.accessToken); // fetch Office365 data with token
        } else {
            console.log(err);
            setLoader(false);
        }
    };

    const getOffice365Data = async (token) => {
        try {
            const response = await fetch(
                "https://graph.microsoft.com/v1.0/users/info@iclayn.com/drive/root/children?$orderby=lastModifiedDateTime%20desc",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            console.log("📡 Office365 Status Code:", response.status);

            // 🛑 Check if token expired or invalid
            if (response.status === 401) {
                console.log("🔑 Token expired — refreshing...");

                // ✅ Call your API to get new access token
                const newToken = await getNewAccessToken(token);

                if (newToken) {
                    // 🔁 Retry fetching data with new token
                    return await getOffice365Data(newToken);
                } else {
                    console.log("❌ Failed to refresh token");
                    setLoader(false);
                    return;
                }
            }

            // ✅ If not 401, continue normally
            const data = await response.json();
            console.log("API Response to get OFFICE 365 DATA:==>", data);
            setDocumentData(data?.value || []);
            setFilteredData(data?.value || []);

        } catch (error) {
            console.error("❌ Error fetching Office 365 data:", error);
        } finally {
            setLoader(false);
        }
    };
    const getNewAccessToken = async () => {
        try {
            const { res, err } = await httpRequest({
                method: 'get',
                path: `/ic/one-drive/refresh-token?tenantId=${organizationData?.tenantId}`,
                navigation: navigation
            });

            if (res?.data?.accessToken) {
                console.log("✅ Got new token");
                setOrganizationData(prev => ({ ...prev, accessToken: res.data.accessToken }));
                return res.data.accessToken;
            } else {
                console.log("⚠️ No token in refresh response", err);
                return null;
            }
        } catch (error) {
            console.log("❌ Error refreshing token", error);
            return null;
        }
    };


    // const getOffice365Data = async (token) => {
    //     try {
    //         const response = await fetch(
    //             "https://graph.microsoft.com/v1.0/users/info@iclayn.com/drive/root/children?$orderby=lastModifiedDateTime%20desc",
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${token}`,
    //                 },
    //             }
    //         );

    //         const data = await response.json();
    //         console.log("API Response to get OFFICE 365 dDATA:==>", data);
    //         setDocumentData(data?.value || []);
    //         setFilteredData(data?.value || []);
    //     } catch (error) {
    //         console.error("Error fetching data:", error);
    //     } finally {
    //         setLoader(false);
    //     }
    // };

    const getDocuments = async () => {
        setLoader(true);
        const { res, err } = await httpRequest({
            method: 'get',
            navigation: navigation,
            path: `/ic/matter/attachment/folder/${matterDetails?.matterId || 0}`
        });
        if (res) {
            setFilteredData(res?.data || []);
            setDocumentData(res?.data || []);
        } else {
            setDocumentData([]);
            console.log('err', err);
        }
        setLoader(false);
    };

    useEffect(() => {
        if (searchText === '') {
            setFilteredData(documentData);
        } else {
            const filtered = documentData.filter((item) =>
                (item?.name || '').toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText, documentData]);

    // folder/file icon
    const renderDocItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    const { matterAttachmentId, matterId, mimeType, name } = item || {};

                    if (item?.folder) {
                        const routeName = tabs === 'Office365' ? 'TaskFileOneDrive' : 'TaskFiles';
                        const params =
                            tabs === 'Office365'
                                ? { indexValue: matterAttachmentId, accessToken: organizationData?.accessToken, fileData: item, activeTab: tabs }
                                : { indexValue: matterAttachmentId, activeTab: tabs };

                        navigation.navigate(routeName, params);
                    } else {
                        navigation.navigate('DocumentViewerScreen', {
                            matterAttachmentId,
                            matterId,
                            mimeType,
                            name,
                        });

                        //                     // if (item?.folder) {
                        //                     //     if (tabs === 'Office365') {

                        //                     //         navigation.navigate('TaskFileOneDrive', { indexValue: item?.matterAttachmentId, accessToken: organizationData?.accessToken, fileData: item, activeTab: tabs });
                        //                     //     }
                        //                     //     else {
                        //                     //         navigation.navigate('TaskFiles', { indexValue: item?.matterAttachmentId, activeTab: tabs });
                        //                     //     }

                        //                     // } else {
                        //                     //     navigation.navigate("DocumentViewerScreen", {
                        //                     //         matterAttachmentId: item?.matterAttachmentId,
                        //                     //         matterId: item?.matterId,
                        //                     //         mimeType: item?.mimeType,
                        //                     //         name: item?.name,
                        //                     //     });
                        //                     // }
                    }
                }}
                style={styles.card}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    {checkTypeForIcon(item)}
                    <MyText style={[styles.titleText, { ellipsisMode: 'tail', width: '80%' }]}>
                        {item?.name}
                    </MyText>
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
