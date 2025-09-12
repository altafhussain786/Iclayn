import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import ImageViewing from "react-native-image-viewing";
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "../../components/Wrapper";
import MyText from "../../components/MyText";
import httpRequest from "../../api/apiHandler";

const FileViewerScreen = ({ route }) => {
    const { matterAttachmentId, matterId, mimeType } = route.params;
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showImage, setShowImage] = useState(false);




    const getFinancialData = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/matter/attachment/1/18/public-url`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "APPI RESPONSE ========================>");
            // setFileUrl(res?.data);
            // if (mimeType?.includes("image/jpeg")) {
            //     setShowImage(true);
            // }
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }


    useEffect(() => {
        // const fetchFileUrl = async () => {
        //     const { res, err } = await httpRequest({
        //         method: 'get',
        //         // path: `/ic/matter/attachment/${matterAttachmentId}/${matterId}/public-url`,
        //         path: `/ic/matter/attachment/1/18/public-url`,
        //         navigation: navigation
        //     })
        //     if (res) {
        //         console.log(res, "APPI RESPONddSE =====>");

        //         // setFileUrl(res?.data);
        //         // if (mimeType?.includes("image/jpeg")) {
        //         //     setShowImage(true);
        //         // }
        //     }
        //     else {
        //         console.log(err, "GET CUSTOMER RESPONSE===>err");
        //     }
        //     // try {    
        //     //     const response = await fetch(
        //     //         `https://api.iclayn.com:8443/ic/matter/attachment/${matterAttachmentId}/${matterId}/public-url`
        //     //     );
        //     //     const json = await response.json();
        //     //     if (json?.data) {
        //     //         setFileUrl(json.data);

        //     //         // agar file image hai to image viewer dikhado
        //     //         if (mimeType?.includes("image/jpeg")) {
        //     //             setShowImage(true);
        //     //         }
        //     //     }
        //     // } catch (error) {
        //     //     console.error("Error fetching file url:", error);
        //     // } finally {
        //     //     setLoading(false);
        //     // }
        // };

        getFinancialData();
    }, [matterAttachmentId]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    // Agar file image nahi hai
    if (!mimeType?.includes("image/jpeg")) {
        return (
            <View style={styles.loader}>
                <Text>⚠️ This file type{mimeType} is not supported in app. </Text>
            </View>
        );
    }

    return (
        <>
            <ScreenHeader />
            {/* <Wrapper> */}
            <MyText>fiel url herer ===={fileUrl}</MyText>
            <ImageViewing
                images={[{ uri: fileUrl }]}
                imageIndex={0}
                visible={showImage}
                onRequestClose={() => setShowImage(false)}
            />
            {/* </Wrapper> */}
        </>
    );
};

export default FileViewerScreen;

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
