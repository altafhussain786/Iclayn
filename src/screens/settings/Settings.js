import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useToast } from 'react-native-toast-notifications'
import { removeToken } from '../../helper/Helpers'
import ScreenHeader from '../../components/ScreenHeader'
import Wrapper from '../../components/Wrapper'
import MyText from '../../components/MyText'
import { calculatefontSize } from '../../helper/responsiveHelper'
import { COLORS, fontFamily } from '../../constants'
import Ionicons from 'react-native-vector-icons/Ionicons'


const Settings = ({ navigation }) => {
    const toast = useToast()
    // const logoutApp = async () => {
    //     setLoader(true)
    //     const { res, err } = await httpRequest({
    //         method: "get",
    //         path: `/ic/auth/logout`,
    //         navigation: navigation,

    //     })
    //     if (res) {
    //         console.log(res, "=========================LOGOUT APP");

    //         const remove = await removeToken();
    //         if (remove === "SUCCESS") {
    //             setLoader(false)

    //             toast.show("Logout successfully", { type: "success" })
    //             navigation.reset({ index: 0, routes: [{ name: "Login" }] })
    //         }
    //         setLoader(false)

    //     }
    //     else {
    //         setLoader(false)

    //         console.log(err, "err");

    //     }
    // }
    const logoutApp = async () => {
        const remove = await removeToken();
        if (remove === "SUCCESS") {
            toast.show("Logout successfully", { type: "success" })
            navigation.reset({ index: 0, routes: [{ name: "Login" }] })
        }
    }
    const item = [
        {
            id: 1,
            title: "Profile",
            icon: "person-circle-outline",
            screen: "Profile",
            onPress: () => navigation.navigate("Profile")
        },
        // {
        //     id:2,
        //     title:"Billing",
        //     icon:"card-outline",
        //     screen:"Billing",
        //     onPress:()=>console.log("Billing")
        // },
        {
            id: 3,
            title: 'Logout',
            icon: "log-out-outline",
            screen: "Logout",
            onPress: logoutApp
        }
    ]
    return (
        <>
            <ScreenHeader isShowTitle={true} isGoBack={true} leftIcon="left" onPress={() => navigation.goBack()} title='Settings' />
            <Wrapper>
                <FlatList
                    removeClippedSubviews={false}
                    data={item}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginVertical: 10,
                            borderBottomWidth: 1,
                            paddingVertical: 15,
                            borderColor: COLORS?.BORDER_LIGHT_COLOR
                        }}>
                            <TouchableOpacity onPress={item.onPress} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                <Ionicons name={item.icon} size={25} />
                                <MyText style={{ fontFamily: fontFamily.regulaer, fontSize: calculatefontSize(2.3) }}>{item.title}</MyText>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </Wrapper>
        </>
    )
}

export default Settings

const styles = StyleSheet.create({})