import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useState } from "react";
import {
    responsiveHeight,
    responsiveWidth,

} from 'react-native-responsive-dimensions';
import { COLORS, IconUri } from "../../../constants";
import MyText from "../../../components/MyText";
import ScreenHeader from "../../../components/ScreenHeader";
import Wrapper from "../../../components/Wrapper";
import { calculatefontSize } from "../../../helper/responsiveHelper";



const More = ({ navigation }) => {
    const data = [
        { type: "Billing", icon: IconUri?.bill, screenName: "Bills" },
        { type: "Parties", icon: IconUri?.parties, screenName: "Parties" },
        { type: "Activities", icon: IconUri?.Activitie, screenName: "Activities" },
        { type: "Documents", icon: IconUri?.documents, screenName: "Documents" },
        { type: "Communications", icon: IconUri?.communication, screenName: "Communications" },
        { type: "Reports", icon: IconUri?.report, screenName: "Reports" }, 
        { type: "Settings", icon: IconUri?.settings, screenName: "Settings" },
     
    ];


    return (
        <>
            <ScreenHeader
            isShowTitle={true}
                title="More"
                // leftIcon="bells"
                onRightPress={() => navigation.navigate("Setting")} rightIcons={["account"]}
            />
           

            <Wrapper>
              
                <FlatList
                    removeClippedSubviews={false}
                    showsVerticalScrollIndicator={false}
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2} // Two cards per row
                    columnWrapperStyle={styles.row} // Styles for row spacing
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => navigation.navigate(item.screenName)}
                        >
                            <Image  source={item.icon} style={styles.icon} />
                            <MyText style={styles.text}  >{item.type}</MyText>

                        </TouchableOpacity>
                    )}
                />
            </Wrapper>
        </>
    );
};

export default More;

const styles = StyleSheet.create({
    row: {
        justifyContent: "space-between", // Spaces cards evenly
        marginBottom: responsiveHeight(2),
    },
    card: {
        width: responsiveWidth(40), // Adjusting width to fit 2 per row
        height: responsiveHeight(15),
        marginHorizontal: responsiveWidth(2),
        marginTop: responsiveHeight(2),
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        boxShadow: "2px 1px 15px 2px rgba(0, 0, 0, 0.18)",
    },
    icon: {
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        resizeMode: "contain",
    },
    text: {
        marginTop: responsiveHeight(1.5),
        fontWeight: "400",
        fontSize: calculatefontSize(1.9),
        textAlign: "center",
    },
});
