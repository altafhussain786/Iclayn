import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import MyText from '../../../../components/MyText';
import { COLORS, fontFamily } from '../../../../constants';
import { removeReminderItem, updateReminderThrough, updateReminderType, updateCounts } from '../../../../store/slices/taskSlice/createItemforReminder';
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
import { calculatefontSize } from '../../../../helper/responsiveHelper';
import TextInputWithTitle from '../../../../components/TextInputWithTitle';
import httpRequest from '../../../../api/apiHandler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { removeExpenseEntry, resetExpenseEntries, updateExpenseEntryField } from '../../../../store/slices/billingSlice/createBillingExpenseEntryItem';



const BillingExpenseEntry = ({ item, navigation }) => {
    const [isOpenUser, setisOpenUser] = useState(false);
    const [isOpenTax, setisOpenTax] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [taxData, setTaxData] = useState([]);
    const [isOpenReminderType, setIsOpenReminderType] = useState(false);

    const dispatch = useDispatch();
    const id = item?.id;

    const getUserData = async () => {
        const { res, err } = await httpRequest(
            {
                method: 'get',
                path: `/ic/user/?status=Active`,
                navigation: navigation
            }
        )
        if (res) {
            setUserData(res?.data);
        }
        else {
            console.log(err, "GET USER DATA RES=====================>", res);

            console.log("errd", err);

        }
    }
    const getTaxData = async () => {
        const { res, err } = await httpRequest(
            {
                method: 'get',
                path: `/ic/tax/?status=Active`,
                navigation: navigation
            }
        )
        if (res) {
            setTaxData(res?.data);
        }
        else {
            console.log(err, "GET USER DATA RES=====================>", res);

            console.log("errd", err);

        }
    }
    useEffect(() => {

        getUserData();
        getTaxData();
    }, [])




    const handleRemoveItem = () => {
        dispatch(removeExpenseEntry({ id: id }));
    };



    return (
        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, paddingBottom: 15 }}>
            {/* Top Row: Delete + ReminderThrough */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>


                <TouchableOpacity style={{ width: '85%' }} onPress={() => setIsDateOpen(true)}>
                    <MyText style={{ color: item.date ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.date || 'Date'}
                    </MyText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveItem}>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>

            {/* Reminder Type Dropdown */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>
                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenUser(true)}>
                    <MyText style={{ color: item.user ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.user || 'User'}
                    </MyText>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10 }}>
                <TextInput
                    placeholder="Description"
                    value={String(item?.description || '')}
                    onChangeText={(txt) => dispatch(updateExpenseEntryField({ id: id, field: 'description', value: txt }))}

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
                    placeholder="Hourly Rate"
                    keyboardType='numeric'
                    value={String(item?.hourlyRate || '')}
                    onChangeText={(txt) => dispatch(updateExpenseEntryField({ id: id, field: 'hourlyRate', value: txt }))}
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

            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>
                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenTax(true)}>
                    <MyText style={{ color: item.tax ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.tax || 'Tax'}
                    </MyText>
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: "flex-end", }}>
                <View style={{ marginVertical: 10, }}>
                    <MyText style={[styles.totalTaxt, {}]}>Tax Amount : {((item?.hourlyRate / 100 || 0) * item?.taxAmount).toFixed(2)}</MyText>
                    <MyText style={[styles.totalTaxt, {}]}>Total : {(item?.hourlyRate || 0)}</MyText>
                </View>
            </View>

            {/* Reminder Through Modal============================================================================ */}
            <BottomModalListWithSearch
                onClose={() => setisOpenUser(false)}
                visible={isOpenUser}
                data={userData}
                searchKey="email"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updateExpenseEntryField({ id: id, field: 'userObj', value: option }));
                            dispatch(updateExpenseEntryField({ id: id, field: 'user', value: option.userProfileDTO?.fullName }));
                            setisOpenUser(false);
                        }}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.BORDER_LIGHT_COLOR }}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>{option.userProfileDTO?.fullName}</MyText>
                    </TouchableOpacity>
                )}
            />
            <DatePicker
                modal
                mode='date'
                open={isDateOpen}
                date={new Date()}
                onConfirm={date => {
                    dispatch(updateExpenseEntryField({ id: id, field: 'date', value: moment(date).format('MM/DD/YYYY') }));
                    setSelectedDate(moment(date).format('MM/DD/YYYY'));
                    setIsDateOpen(false);

                }}
                onCancel={() => {
                    setIsDateOpen(false);
                }}
            />

            {/* Reminder Type Modal */}
            <BottomModalListWithSearch
                onClose={() => setisOpenTax(false)}
                visible={isOpenTax}
                data={taxData}
                searchKey="name"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {

                            dispatch(updateExpenseEntryField({ id: id, field: 'tax', value: option.name }));
                            dispatch(updateExpenseEntryField({ id: id, field: 'taxObj', value: option }));
                            dispatch(updateExpenseEntryField({ id: id, field: 'taxAmount', value: option?.rate }));
                            setisOpenTax(false);
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

export default BillingExpenseEntry;

const styles = StyleSheet.create({
    totalTaxt: {
        // fontWeight: "600",
        fontSize: calculatefontSize(1.9)

    }
});
