import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import MyText from '../../../components/MyText';
import { COLORS, fontFamily } from '../../../constants';
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import { removeTimeEntry, updateTimeEntryField } from '../../../store/slices/billingSlice/createBillingTimeEntryItem';
import { removePhoneNumber, updatePhoneNumberField } from '../../../store/slices/clientSlice/createItemForAddPhone';
import { CountryPicker } from "react-native-country-codes-picker";

const AddPhoneNumber = ({ item, navigation }) => {
    const [isOpenUser, setisOpenUser] = useState(false);
    const [isOpenType, setisOpenType] = useState(false);
    const [isSwitchOn, setSwitchOn] = useState(false);
    const [show, setShow] = useState(false);
    const [dialCode, setDialCode] = useState('+44');
    const [flagEmoji, setFlagEmoji] = useState('🇬🇧'); // default flag
    const dispatch = useDispatch();
    const id = item?.id;

    const typeData = [
        {
            id: 1,
            name: "Personal",
            value: "Personal"
        },
        {
            id: 2,
            name: "Work",
            vale: "work"
        },
        {
            id: 3,
            name: "Home",
            value: "home"
        },
        {
            id: 4,
            name: "Fax",
            value: "others"
        },]

    const handleRemoveItem = () => {
        dispatch(removePhoneNumber({ id: id }));
    };

    return (
        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, paddingBottom: 15 }}>
            {/* Top Row: Delete + ReminderThrough */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>


                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenType(true)}>
                    <MyText style={{ color: item.phoneNumberType ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.phoneNumberType || 'Type'}
                    </MyText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveItem}>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>

            {/* Reminder Type Dropdown */}

            <View style={{ marginTop: 10 }}>
                <CountryPicker
                    onBackdropPress={() => setShow(false)}
                    show={show}
                    style={{
                        modal: {
                            height: 500,
                        },
                    }}
                    pickerButtonOnPress={(item) => {
                        console.log(item, "item");

                        dispatch(updatePhoneNumberField({ id: id, field: 'pickerDetails', value: item }));
                        setDialCode(item.dial_code);
                        setFlagEmoji(item.flag); // ✅ Set flag emoji
                        setShow(false);
                    }}
                />

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 5,
                        paddingHorizontal: 10,
                        borderColor: '#ddd',
                    }}
                >
                    <TouchableOpacity onPress={() => setShow(true)}>
                        <MyText>{flagEmoji} {dialCode}</MyText> {/* ✅ flag + code */}
                    </TouchableOpacity>

                    <TextInput
                        keyboardType='phone-pad'
                        style={{ marginLeft: 10, flex: 1 }}
                        value={item?.phoneNumber}
                        placeholder="Phone Number"
                        placeholderTextColor={COLORS?.LIGHT_COLOR}
                        onChangeText={(txt) =>
                            dispatch(updatePhoneNumberField({ id: id, field: 'phoneNumber', value: txt }))
                        }
                    />
                </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                <MyText style={styles.title}>Is Primary</MyText>
                <Switch
                    value={item?.isEmailPrimary}
                    onValueChange={(val) => { setSwitchOn(val), dispatch(updatePhoneNumberField({ id: id, field: 'isPhoneNumberPrimary', value: val })) }}
                    thumbColor={isSwitchOn ? "#ffffff" : "#ffffff"}
                    trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                />
            </View>
            <BottomModalListWithSearch
                onClose={() => setisOpenType(false)}
                visible={isOpenType}
                data={typeData}
                searchKey="name"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updatePhoneNumberField({ id: id, field: 'phoneNumberType', value: option.name }));
                            setisOpenType(false);
                        }}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.BORDER_LIGHT_COLOR }}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>{option.name}</MyText>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default AddPhoneNumber;

const styles = StyleSheet.create({
    totalTaxt: {
        fontSize: calculatefontSize(1.9)

    }
});
