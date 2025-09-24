import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text, Image } from "react-native";
import ImageViewing from "react-native-image-viewing";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "../../components/Wrapper";
import MyText from "../../components/MyText";
import httpRequest from "../../api/apiHandler";

const FileViewerScreen = ({ navigation, route }) => {
    const { matterAttachmentId, matterId, mimeType } = route.params;
    const { indexValue, accessToken, fileData, activeTab } = route.params
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showImage, setShowImage] = useState(false);




    console.log(matterAttachmentId, matterId, mimeType, "route.params");

    const getFinancialData = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: mimeType ? `/ic/matter/attachment/1/${matterId}/public-url` : `/ic/matter/attachment/5/22/public-url`,
            navigation: navigation,

        })
        if (res) {
            console.log(res?.data, "APPI RESPONSE ==========FINANCIAL DATA==============>");

            setFileUrl(res?.data); // direct image url
            setLoading(false);
            setShowImage(true);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    const getDocumentPreview = async () => {
        try {
            const response = await fetch(
                `https://graph.microsoft.com/v1.0/drives/b!xO5SWHW3aUqC8o1TfAqDDQyrwgwM8edCq4nn2WKncPALyPhtkY_JSqnGbT1kS1Gt/items/${fileData?.id}/thumbnails/0/large`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const data = await response.json();
            console.log("thumbnail response ==>", data);

            setFileUrl(data?.url); // direct image url
            setLoading(false);
            setShowImage(true);
        } catch (error) {
            console.error("Error fetching thumbnail:", error);
        }
    };


    useEffect(() => {
        if (activeTab === "Office365") {
            getDocumentPreview();
        }
        else {
            getFinancialData();

        }
    }, [matterAttachmentId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    // Agar file image nahi hai
    // if (!mimeType?.includes("image/jpeg")) {
    //     return (
    //         <View style={styles.loader}>
    //             <Text>⚠️ This file type{mimeType} is not supported in app. </Text>
    //         </View>
    //     );
    // }

    return (
        <>
            <ScreenHeader />
            {/* <Wrapper> */}
            <MyText>fiel url herer ===={fileUrl}</MyText>

            <ImageViewing
                images={[{ uri: fileUrl }]}
                imageIndex={0}
                visible={showImage}
                onRequestClose={() => navigation.goBack()}
            />
            {/* </Wrapper> */}
        </>
    );
};

export default FileViewerScreen;

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
