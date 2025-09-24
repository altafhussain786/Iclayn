import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import MyText from '../../../../components/MyText';
import { COLORS } from '../../../../constants';
import { removeRelatedContact, updateParty, updatePartyType, updateRelatedContact, updatehourlyRate } from '../../../../store/slices/matterSlice/createItemforRelateParties';
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
import httpRequest from '../../../../api/apiHandler';
import { calculatefontSize } from '../../../../helper/responsiveHelper';
import TextInputWithTitle from '../../../../components/TextInputWithTitle';
import { removeBillingRate, updateBillingRate, updateHourlyRate, updateServiceItem } from '../../../../store/slices/matterSlice/createItemForBillingRate';
import { object } from 'yup';

const BillingRateItem = ({ billingMethod, item, navigation }) => {

    console.log(item, "====?");

    //Account name Selections
    const [selectFirmUser, setselectFirmUser] = useState(item?.firmUser || 'What is the contacts name ?');
    const [selectServiceItem, setselectServiceItem] = useState(item?.serviceItemObj?.name || 'Find Category');
    const [hourlyRate, sethourlyRate] = useState(item?.hourlyRate || null);
    const [isOpenDropDown, setisOpenDropDown] = useState(false);
    const [isOpenCategory, setIsOpenCategory] = useState(false);

    const [billingData, setbillingData] = useState([]);
    const [serviceItemData, setserviceItemData] = useState([]);
    const dispatch = useDispatch();
    const PID = item?.pId;

    const getBillingData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })

        if (res) {
            setbillingData(res?.data);
            if (Object.keys(item).length > 0) {
                const selectedParty = res?.data?.find(pt => pt?.userId === item?.firmUserId);
                setselectFirmUser(selectedParty?.userProfileDTO?.fullName || 'What is the contacts name ?'); // <-- Proper value
            }
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }
    const getServiceItem = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/si/?status=Active`,
            navigation: navigation
        })

        if (res) {
            setserviceItemData(res?.data);

        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }



    useEffect(() => {
        getServiceItem();
    }, [isOpenCategory])



    useEffect(() => {
        getBillingData();
    }, [isOpenDropDown])

    const handleRemoveItem = () => {
        console.log(item, "====?");

        dispatch(removeBillingRate({
            pId: item?.pId
        }))

    };

    return (
        <>
            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR }}>
                <View >

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ width: "75%" }}>
                            <>
                                <MyText style={styles.lables}>
                                    Firm user <MyText style={{ color: "red" }}>*</MyText>
                                </MyText>
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: COLORS?.DIVIDER_BORDER_COLOR, borderRadius: 5, marginTop: 10 }}>
                                    <TouchableOpacity onPress={handleRemoveItem}>
                                        <AntDesign name="delete" size={20} color="red" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setisOpenDropDown(true)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                        <MyText style={{ color: selectFirmUser === "What is the contacts name ?" ? COLORS?.LIGHT_COLOR : COLORS?.PRIMARY_COLOR }}>{selectFirmUser}</MyText>
                                    </TouchableOpacity>
                                </View>
                                {billingMethod == "Fixed fee details" &&
                                    <>
                                        <View style={{ marginVertical: 10 }}>
                                            <MyText style={styles.lables}>
                                                Service Item
                                            </MyText>
                                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: COLORS?.DIVIDER_BORDER_COLOR, borderRadius: 5, marginTop: 10 }}>

                                                <TouchableOpacity onPress={() => setIsOpenCategory(true)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                                    <MyText style={{ color: selectServiceItem === "Find Category" ? COLORS?.LIGHT_COLOR : COLORS?.PRIMARY_COLOR }}>{selectServiceItem}</MyText>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                }
                                <TextInputWithTitle
                                    keyboardType='numeric'
                                    value={hourlyRate?.toString()}
                                    title="hourlyRate"
                                    isRequired={true}
                                    placeholder={'hourlyRate'}
                                    onChangeText={(txt) => { sethourlyRate(txt); dispatch(updateHourlyRate({ pId: PID, hourlyRate: Number(txt) })) }}
                                />


                            </>
                        </View>

                        {/* //Modals for account name */}
                        <BottomModalListWithSearch
                            onClose={() => setisOpenDropDown(false)}
                            renderItem={({ item }) => (

                                <TouchableOpacity

                                    onPress={() => {
                                        dispatch(updateBillingRate({
                                            pId: PID,
                                            firmUserObj: item,
                                            firmUser: item?.userProfileDTO?.fullName || '',
                                            firmUserId: item?.userId, // <-- FIXED: Use dynamic ID
                                            hourlyRate: item?.userProfileDTO?.billingRate || 0
                                        }));
                                        sethourlyRate(item?.userProfileDTO?.billingRate || 0);
                                        setselectFirmUser(item?.userProfileDTO?.fullName || 'Unknown User'); // <-- fallback added
                                        setisOpenDropDown(false);
                                    }}
                                    style={{
                                        borderBottomWidth: 1,
                                        paddingVertical: 10,
                                        borderColor: COLORS?.BORDER_LIGHT_COLOR
                                    }}
                                >
                                    <MyText
                                        style={{
                                            fontSize: calculatefontSize(1.9)
                                        }}
                                    >
                                        {item?.userProfileDTO?.fullName}
                                    </MyText>
                                </TouchableOpacity>
                            )}
                            visible={isOpenDropDown}
                            data={billingData}
                            searchKey="email"
                        />


                        <BottomModalListWithSearch
                            onClose={() => setIsOpenCategory(false)}
                            renderItem={({ item }) => (

                                <TouchableOpacity

                                    onPress={() => {
                                        dispatch(updateServiceItem({
                                            pId: PID,
                                            serviceItemObj: item,
                                        }));
                                        // sethourlyRate(item?.userProfileDTO?.billingRate || 0);
                                        setselectServiceItem(item?.name || 'Unknown User'); // <-- fallback added
                                        setIsOpenCategory(false);
                                    }}
                                    style={{
                                        borderBottomWidth: 1,
                                        paddingVertical: 10,
                                        borderColor: COLORS?.BORDER_LIGHT_COLOR
                                    }}
                                >
                                    <MyText
                                        style={{
                                            fontSize: calculatefontSize(1.9)
                                        }}
                                    >
                                        {item?.name}
                                    </MyText>
                                </TouchableOpacity>
                            )}
                            visible={isOpenCategory}
                            data={serviceItemData}
                            searchKey="name"
                        />
                    </View>
                </View>
            </View>
        </>
    )
}
export default BillingRateItem

const styles = StyleSheet.create({
    lables: {
        color: '#627585',
        // marginBottom: 5,
        marginTop: 10,
        fontWeight: '600',
    },
})