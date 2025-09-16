

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
import AsyncStorage from '@react-native-async-storage/async-storage';

const Documents = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails;
    const dispatch = useDispatch();

    const [tabs, setTabs] = React.useState('Documents');
    const [documentData, setDocumentData] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [searchText, setSearchText] = useState('');
    const [loader, setLoader] = React.useState(false);


    // new states @=====> 
    const [organizationData, setOrganizationData] = useState({});


    const getOrgaanizationData = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/organization/?orgCode=5024000001`,
            navigation: navigation
        })
        if (res) {
            setOrganizationData(res?.data);
        }
        else {
            console.log(err);
        }
    }

    useEffect(() => {
        if (tabs === 'Office365') {
            getOrgaanizationData();
        }
    }, [tabs])

    const getOffice365Data = async () => {
        try {
            const token = organizationData?.accessToken;
            console.log(token, 'token');

            const response = await fetch("https://graph.microsoft.com/v1.0/users/info@iclayn.com/drive/root/children?$orderby=lastModifiedDateTime%20desc", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // token added here
                },
            });

            const data = await response.json();
            console.log("API Response:==>", data?.value);
            setDocumentData(data?.value || []);
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }

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
            setLoader(false);
        } else {
            setDocumentData([]);
            console.log('err', err);
            setLoader(false);
        }
    };

    useEffect(() => {
        if (tabs === 'Documents') {

            getDocuments();
        }
        else {
            getOffice365Data();
        }
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
