import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import ScreenHeader from '../../../../../components/ScreenHeader'
import Wrapper from '../../../../../components/Wrapper'
import MyText from '../../../../../components/MyText'
import httpRequest from '../../../../../api/apiHandler'
import { COLORS, fontFamily, IconUri } from '../../../../../constants'
import Loader from '../../../../../components/Loader'
import { addDocument } from '../../../../../store/slices/taskSlice/createItemforDocuments'
import { useDispatch } from 'react-redux'
import { checkTypeForIcon } from '../../../../../helper/Helpers'
import moment from 'moment'
import { calculatefontSize } from '../../../../../helper/responsiveHelper'

const TaskFileOneDrive = ({ navigation, route }) => {
    const indexValue = route?.params?.indexValue
    const fileData = route?.params?.fileData
    const accessToken = route?.params?.accessToken
    const activeTab = route?.params?.activeTab
    const dispatch = useDispatch()

    const [documentData, setDocumentData] = React.useState([])
    const [loader, setLoader] = React.useState(false)
    const getDocuments = async () => {
        try {

            setLoader(true)
            const response = await fetch(`https://graph.microsoft.com/v1.0/users/info@iclayn.com/drive/items/${fileData?.id}/children?$orderby=lastModifiedDateTime%20desc`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`, // token added here
                },
            });

            const data = await response.json();
            console.log("API Response:d==l>", data?.value, accessToken);
            setDocumentData(data?.value || []);
            setLoader(false)

            return data;
        } catch (error) {
            setLoader(false)

            console.error("Error fetching data:", error);
        }
        setLoader(false)


    }

    useEffect(() => {
        getDocuments();
    }, [])


    console.log(documentData, 'documentData');

    return (
        <>
            <ScreenHeader
                extraStyle={{ backgroundColor: '#F5F6F8' }}
                isGoBack={true}
                onPress={() => { navigation.goBack() }}
                isShowTitle={true}
                title="Documents"
            />
            <Wrapper>

                {loader
                    ?
                    <Loader />
                    :

                    <FlatList
                        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                        showsVerticalScrollIndicator={false}
                        data={documentData}
                        ListEmptyComponent={() =>
                            <View style={{ height: Dimensions.get('window').height, justifyContent: "center", alignItems: "center" }}>
                                <Image style={{ height: 100, width: 100, tintColor: "gray" }} source={{ uri: 'https://static.thenounproject.com/png/4880008-200.png' }} />
                                <MyText style={{ fontSize: calculatefontSize(1.5), color: "gray" }}>No Document Found</MyText>
                            </View>
                        }
                        ListFooterComponent={() => <View style={{ height: 100 }} />}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log(item, 'item', activeTab);

                                        if (activeTab === 'Office365') {
                                            if (item?.folder || item?.folder?.childCount) {
                                                navigation.navigate('TaskDocumentOneDrive', {
                                                    indexValue: item?.matterAttachmentId,
                                                    accessToken,
                                                    fileData: item,
                                                    activeTab,
                                                });
                                            } else {
                                                navigation.navigate('DocumentViewerScreen', {
                                                    indexValue: item?.matterAttachmentId,
                                                    accessToken,
                                                    fileData: item,
                                                    activeTab,

                                                });
                                                // dispatch(addDocument(item));

                                                // const state = navigation.getState();
                                                // const routes = state.routes;
                                                // let popCount = 1;

                                                // for (let i = routes.length - 1; i >= 0; i--) {
                                                //     if (routes[i].name === "CreateTask" || routes[i].name === "EditTask") {
                                                //         break;
                                                //     }
                                                //     popCount++;
                                                // }

                                                // navigation.pop(popCount - 1); // Go back to CreateTask screen
                                            }
                                        } else {
                                            if (item?.folder) {
                                                navigation.navigate('TaskFiles', {
                                                    indexValue: item?.matterAttachmentId,
                                                    activeTab,
                                                });
                                                // navigation.navigate("TaskDocuments", { indexValue: item?.templateId })
                                            } else {
                                                navigation.navigate('DocumentViewerScreen', {
                                                    matterAttachmentId,
                                                    matterId,
                                                    mimeType,
                                                    name,
                                                });
                                                // dispatch(addDocument(item));

                                                // const state = navigation.getState();
                                                // const routes = state.routes;
                                                // let popCount = 1;

                                                // for (let i = routes.length - 1; i >= 0; i--) {
                                                //     if (routes[i].name === "CreateTask" || routes[i].name === "EditTask") {
                                                //         break;
                                                //     }
                                                //     popCount++;
                                                // }

                                                // navigation.pop(popCount - 1); // Go back to CreateTask screen
                                            }
                                        }
                                        // console.log(item, 'TaskFileOneDrive',activeTab);

                                        // if (item?.folder) {
                                        //     if (activeTab === 'Office365') {
                                        //         navigation.navigate('TaskFileOneDrive', { indexValue: item?.matterAttachmentId, accessToken: accessToken, fileData: item, activeTab: activeTab });
                                        //     }
                                        //     else {
                                        //         navigation.navigate('TaskFiles', { indexValue: item?.matterAttachmentId, activeTab: activeTab });
                                        //     }
                                        //     // navigation.navigate("TaskDocuments", { indexValue: item?.templateId })
                                        // }
                                        // else {
                                        //     dispatch(addDocument(item));

                                        //     const state = navigation.getState();
                                        //     const routes = state.routes;
                                        //     let popCount = 1;

                                        //     for (let i = routes.length - 1; i >= 0; i--) {
                                        //         if (routes[i].name === "CreateTask") {
                                        //             break;
                                        //         }
                                        //         else if (routes[i].name === "EditTask") {
                                        //             break;
                                        //         }
                                        //         popCount++;
                                        //     }

                                        //     navigation.pop(popCount - 1); // Go back to CreateTask screen
                                        // }
                                    }}
                                    style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 10, }}>
                                        {checkTypeForIcon(item)}
                                        <View style={{ width: "90%" }}>
                                            <MyText style={{ fontWeight: '500', ellipsisMode: 'tail', }}>{item?.name}</MyText>
                                            <MyText style={{ fontWeight: '400', color: "gray", fontSize: calculatefontSize(1.5) }}>{moment(item?.createdDateTime).format("DD-MM-YYYY")}</MyText>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                }
            </Wrapper>

        </>
    )
}

export default TaskFileOneDrive

const styles = StyleSheet.create({})