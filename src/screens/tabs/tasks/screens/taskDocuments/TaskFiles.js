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

const TaskFiles = ({ navigation, route }) => {
    const indexValue = route?.params?.indexValue
    const { matterId, mimeType, name, } = route?.params
    const dispatch = useDispatch()

    const [documentData, setDocumentData] = React.useState([])
    const [loader, setLoader] = React.useState(false)
    const getDocuments = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: `get`,
            header: { "x_country": 'United Kingdom' },
            path: `/ic/matter/attachment/folder/${indexValue}`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "DOCUMENTS");
            setDocumentData(res?.data);
            setLoader(false)
        }
        else {
            setLoader(false)
            console.log(err, "GET CUSTOMER RESPONSEd===>err");
        }
    }

    useEffect(() => {
        getDocuments();
    }, [])

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
                                        if (item?.folder) {
                                            navigation.navigate("TaskDocuments", { indexValue: item?.templateId })
                                        }
                                        else {
                                            navigation.navigate('DocumentViewerScreen', {
                                                matterAttachmentId: indexValue,
                                                matterId,
                                                mimeType,
                                                name,
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
                                        <MyText style={{}}>{moment(item?.createdDateTime).format("DD-MM-YYYY")}</MyText>
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

export default TaskFiles

const styles = StyleSheet.create({})