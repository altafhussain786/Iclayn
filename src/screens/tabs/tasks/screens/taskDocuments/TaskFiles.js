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

    // const checkTypeForIcon = (item, size = 30) => {
    //     // agar folder ho to folder icon return kare
    //     if (item?.folder) {
    //         return (
    //             <Image
    //                 source={{ uri: "https://img.icons8.com/color/48/folder-invoices--v1.png" }} // yellow folder
    //                 style={{ width: size, height: size, resizeMode: "contain" }}
    //             />
    //         );
    //     }

    //     const name = item?.name || "";
    //     const ext = name.split(".").pop().toLowerCase();

    //     let iconUri;
    //     switch (ext) {
    //         case "pdf":
    //             iconUri = "https://img.icons8.com/color/48/pdf.png";
    //             break;
    //         case "doc":
    //         case "docx":
    //             iconUri = "https://img.icons8.com/color/48/ms-word.png";
    //             break;
    //         case "xls":
    //         case "xlsx":
    //             iconUri = "https://img.icons8.com/color/48/ms-excel.png";
    //             break;
    //         case "ppt":
    //         case "pptx":
    //             iconUri = "https://img.icons8.com/color/48/ms-powerpoint.png";
    //             break;
    //         case "jpg":
    //         case "jpeg":
    //         case "png":
    //         case "gif":
    //             iconUri = "https://img.icons8.com/color/48/image.png";
    //             break;
    //         case "mp4":
    //         case "mov":
    //         case "avi":
    //             iconUri = "https://img.icons8.com/color/48/video.png";
    //             break;
    //         case "mp3":
    //         case "wav":
    //             iconUri = "https://img.icons8.com/color/48/audio.png";
    //             break;
    //         case "zip":
    //         case "rar":
    //             iconUri = "https://img.icons8.com/color/48/zip.png";
    //             break;
    //         case "html":
    //             iconUri = "https://img.icons8.com/color/48/html-5--v1.png";
    //             break;
    //         default:
    //             iconUri = "https://img.icons8.com/ios-filled/50/file.png";
    //     }

    //     return (
    //         <Image
    //             source={{ uri: iconUri }}
    //             style={{ width: size, height: size, resizeMode: "contain" }}
    //         />
    //     );
    // };

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
                                            dispatch(addDocument(item));

                                            const state = navigation.getState();
                                            const routes = state.routes;
                                            let popCount = 1;

                                            for (let i = routes.length - 1; i >= 0; i--) {
                                                if (routes[i].name === "CreateTask") {
                                                    break;
                                                }
                                                else if (routes[i].name === "EditTask") {
                                                    break;
                                                }
                                                popCount++;
                                            }

                                            navigation.pop(popCount - 1); // Go back to CreateTask screen
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