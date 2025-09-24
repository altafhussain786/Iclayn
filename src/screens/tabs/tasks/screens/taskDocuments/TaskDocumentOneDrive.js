import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import ScreenHeader from '../../../../../components/ScreenHeader'
import Wrapper from '../../../../../components/Wrapper'
import MyText from '../../../../../components/MyText'
import httpRequest from '../../../../../api/apiHandler'
import { IconUri } from '../../../../../constants'
import Loader from '../../../../../components/Loader'
import { addDocument } from '../../../../../store/slices/taskSlice/createItemforDocuments'
import { useDispatch } from 'react-redux'
import { checkTypeForIcon } from '../../../../../helper/Helpers'
import moment from 'moment'
import { calculatefontSize } from '../../../../../helper/responsiveHelper'

const TaskDocumentOneDrive = ({ navigation, route }) => {

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
            console.log("API Response:==l>", data?.value, accessToken);
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



    // const checkTypeForIcon = (type) => {
    //     if (type) {
    //         return <Image source={IconUri?.folder} style={{ height: 20, width: 20 }} />
    //     }
    //     else {
    //         return <Image source={IconUri?.word} style={{ height: 20, width: 20 }} />
    //     }
    // }
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
                                <Image style={{ height: 70, width: 70, tintColor: "gray" }} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149877.png' }} />
                                <MyText style={{ fontSize: calculatefontSize(1.5), color: "gray" }}>No Folder Found</MyText>
                            </View>
                        }
                        ListFooterComponent={() => <View style={{ height: 100 }} />}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item?.folder || item?.folder?.childCount > 0) {
                                            navigation.navigate("TaskFileOneDrive", { indexValue: indexValue, accessToken: accessToken, fileData: item, activeTab: activeTab })
                                        }
                                        else {
                                            navigation.navigate('DocumentViewerScreen', {
                                                indexValue: indexValue, accessToken: accessToken, fileData: item, activeTab: activeTab
                                            });
                                            // dispatch(addDocument(item));

                                            // const state = navigation.getState();
                                            // const routes = state.routes;
                                            // let popCount = 1;

                                            // for (let i = routes.length - 1; i >= 0; i--) {
                                            //     if (routes[i].name === "CreateTask") {
                                            //         break;
                                            //     }
                                            //     else if (routes[i].name === "EditTask") {
                                            //         break;
                                            //     }
                                            //     popCount++;
                                            // }

                                            // navigation.pop(popCount - 1); // Go back to CreateTask screen
                                        }
                                    }}
                                    style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: "center", gap: 10 }}>
                                        {checkTypeForIcon(item)}
                                        <MyText style={{ ellipsisMode: 'tail', width: '95%' }}>{item?.name}</MyText>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />}
            </Wrapper>
        </>
    )
}

export default TaskDocumentOneDrive

const styles = StyleSheet.create({})