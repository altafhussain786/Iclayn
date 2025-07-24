import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import MyText from '../../../components/MyText';
import { COLORS, fontFamily, prefixList } from '../../../constants';
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import { removeTimeEntry, updateTimeEntryField } from '../../../store/slices/billingSlice/createBillingTimeEntryItem';
import httpRequest from '../../../api/apiHandler';
import { removeContactPerson, updateContactPersonField } from '../../../store/slices/clientSlice/createItemForContactPerson';


const AddContactPerson = ({ item, navigation }) => {
    const [isOpenUser, setisOpenUser] = useState(false);
    const [isOpenPrefix, setisOpenPrefix] = useState(false);

    //ENd
    const [isOpenType, setisOpenType] = useState(false);
    const [isSwitchOn, setSwitchOn] = useState(false);
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
            value: "fax"
        },

        {
            id: 5,
            name: "Mobile",
            value: "mobile"
        },
        {
            id: 6,
            name: "Pager",
            value: "pager"
        },
        {
            id: 7,
            name: "Other",
            value: "other"
        },

    ]

    const handleRemoveItem = () => {
        dispatch(removeContactPerson({ id: id }));
    };

    return (
        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, paddingBottom: 15 }}>
            {/* Top Row: Delete + ReminderThrough */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>

                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenPrefix(true)}>
                    <MyText style={{ color: item.prefixName ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.prefixName || 'Prefix'}
                    </MyText>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRemoveItem}>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>

                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenType(true)}>
                    <MyText style={{ color: item.type ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.type || 'Type'}
                    </MyText>
                </TouchableOpacity>
            </View>
            {/* Reminder Type Dropdown */}

            <View style={{ marginTop: 10 }}>
                <TextInput
                    value={item?.firstName}
                    placeholder="First Name "
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateContactPersonField({ id: id, field: 'firstName', value: txt }))}
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        borderColor: '#ddd',
                        fontSize: calculatefontSize(1.8),
                        color: COLORS.PRIMARY_COLOR
                    }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <TextInput
                    value={item?.middleName}
                    placeholder="Middle Name"
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateContactPersonField({ id: id, field: 'middleName', value: txt }))}
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        borderColor: '#ddd',
                        fontSize: calculatefontSize(1.8),
                        color: COLORS.PRIMARY_COLOR
                    }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <TextInput
                    value={item?.lastName}
                    placeholder="Last Name"
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateContactPersonField({ id: id, field: 'lastName', value: txt }))}
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        borderColor: '#ddd',
                        fontSize: calculatefontSize(1.8),
                        color: COLORS.PRIMARY_COLOR
                    }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <TextInput
                    value={item?.email}
                    placeholder="Email"
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateContactPersonField({ id: id, field: 'email', value: txt }))}
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        borderColor: '#ddd',
                        fontSize: calculatefontSize(1.8),
                        color: COLORS.PRIMARY_COLOR
                    }}
                />
            </View>
            <View style={{ marginTop: 10 }}>
                <TextInput
                    value={item?.phoneNumber}
                    placeholder="Phone Number"
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateContactPersonField({ id: id, field: 'phoneNumber', value: txt }))}
                    style={{
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 10,
                        borderColor: '#ddd',
                        fontSize: calculatefontSize(1.8),
                        color: COLORS.PRIMARY_COLOR
                    }}
                />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                <MyText style={styles.title}>Is Primary</MyText>
                <Switch
                    value={item?.isContactPersonPrimary}
                    onValueChange={(val) => { setSwitchOn(val), dispatch(updateContactPersonField({ id: id, field: 'isContactPersonPrimary', value: val })) }}
                    thumbColor={isSwitchOn ? "#ffffff" : "#ffffff"}
                    trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                />
            </View>

            <BottomModalListWithSearch
                onClose={() => setisOpenPrefix(false)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updateContactPersonField({ id: id, field: 'prefixName', value: item.value }));
                            setisOpenPrefix(false);
                        }}
                        style={styles.itemStyle}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                            {item?.value}
                        </MyText>
                    </TouchableOpacity>
                )}
                visible={isOpenPrefix}
                data={prefixList}
                searchKey="value"
            />

            <BottomModalListWithSearch
                onClose={() => setisOpenType(false)}
                visible={isOpenType}
                data={typeData}
                searchKey="name"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updateContactPersonField({ id: id, field: 'type', value: option.name }));
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

export default AddContactPerson;

const styles = StyleSheet.create({
    totalTaxt: {
        fontSize: calculatefontSize(1.9)
    },
    itemStyle: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderColor: COLORS?.BORDER_LIGHT_COLOR
    },
});
