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
import { calculatefontSize } from '../../../../../helper/responsiveHelper'

const TaskDocuments = ({ navigation, route }) => {
    const indexValue = route?.params?.indexValue
    const dispatch = useDispatch()
    const [documentData, setDocumentData] = React.useState([])
    const [loader, setLoader] = React.useState(false)
    const getDocuments = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: `get`,
            header: { "x_country": 'United Kingdom' },
            path: `/ic/doc-temp/folder/${indexValue}`,
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


    const checkTypeForIcon = (type) => {
        if (type) {
            return <Image source={IconUri?.folder} style={{ height: 20, width: 20 }} />
        }
        else {
            return <Image source={IconUri?.word} style={{ height: 20, width: 20 }} />
        }
    }
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
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        if (item?.folder) {
                                            navigation.navigate("TaskFiles", { indexValue: item?.templateId })
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
                                        {checkTypeForIcon(item?.folder)}
                                        <MyText>{item?.name}</MyText>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />}
            </Wrapper>
        </>
    )
}

export default TaskDocuments

const styles = StyleSheet.create({})