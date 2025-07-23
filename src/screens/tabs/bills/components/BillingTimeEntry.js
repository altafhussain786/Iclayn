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
import { removeTimeEntry, updateTimeEntryField } from '../../../../store/slices/billingSlice/createBillingTimeEntryItem';
import httpRequest from '../../../../api/apiHandler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';



const BillingTimeEntry = ({ item, navigation }) => {
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



    const reminderTypeOptions = [
        { label: 'Minutes', value: 'Minutes' },
        { label: 'Hours', value: 'Hours' },
        { label: 'Days', value: 'Days' }
    ];

    const handleRemoveItem = () => {
        dispatch(removeTimeEntry({ id: id }));
    };
    const formatDurationInput = (text) => {
        const digits = text.replace(/\D/g, ''); // remove all non-digit characters
        const hh = digits.slice(0, 2);
        const mm = digits.slice(2, 4);
        const ss = digits.slice(4, 6);

        let formatted = hh;
        if (digits.length > 2) formatted += ':' + mm;
        if (digits.length > 4) formatted += ':' + ss;

        return formatted;
    };


    //   const calculateAmounts = () => {
    //    let duration=0
    //    let hourlyRate=0
    //    let taxAmount=0
    //    let toalTax=0
    //    let totalAmount

    //    item?.items?.forEach(item => {

    //     duration += item?.duration
    //     hourlyRate += item?.hourlyRate
    //     taxAmount += item?.taxAmount
    //     toalTax += item?.toalTax
    //     totalAmount += item?.totalAmount

    //    })


    //     const toalTaxOnAmt=



    // let grossAmount = 0;
    // let totalDiscount = 0;
    // let totalTax = 0;
    // let totalFinalAmount = 0;

    // items.forEach(item => {
    //     const basePrice =item?.productRate?.rate || item?.pSaleRatePlan?.sRPRate || 0;
    //     const quantity = item?.quantity == 0 ? 1 : item?.quantity || 1;
    //     const discount = item?.discount || 0;

    //     const grossItemPrice = basePrice * quantity;
    //     const itemDiscount = (grossItemPrice * discount) / 100;
    //     const discountedPrice = grossItemPrice - itemDiscount;
    //     const taxAmount = (discountedPrice * (item?.pTax?.taxAmount ? (item?.pTax?.taxAmount * 100 / discountedPrice) : 0)) / 100;
    //     const finalTaxAmount = taxAmount * quantity
    //     grossAmount += grossItemPrice;
    //     totalDiscount += itemDiscount;
    //     totalTax += finalTaxAmount;
    //     totalFinalAmount += discountedPrice + finalTaxAmount;
    // });

    //     return { grossAmount, totalDiscount, totalTax, totalFinalAmount };
    // };

    // const { grossAmount, totalDiscount, totalTax, totalFinalAmount } = calculateAmounts();

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
                    onChangeText={(txt) => dispatch(updateTimeEntryField({ id: id, field: 'description', value: txt }))}

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
                    keyboardType='numeric'
                    placeholder="Duration (hh:mm:ss)"
                    value={String(item?.duration || '')}
                    onChangeText={(txt) => {
                        const formatted = formatDurationInput(txt);
                        dispatch(updateTimeEntryField({ id, field: 'duration', value: formatted }));
                    }}
                    onEndEditing={(e) => {
                        const txt = e.nativeEvent.text;
                        const durationRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

                        if (!durationRegex.test(txt)) {
                            Alert.alert('Invalid Format', 'Please enter duration in hh:mm:ss format (e.g. 02:30:00)');
                            return;
                        }

                        const [hh, mm, ss] = txt.split(':').map(Number);
                        const totalHours = hh + mm / 60 + ss / 3600;

                        dispatch(updateTimeEntryField({
                            id,
                            field: 'totalDuration',
                            value: totalHours,
                        }));
                    }}
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
                    onChangeText={(txt) => dispatch(updateTimeEntryField({ id: id, field: 'hourlyRate', value: txt }))}
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

            <View style={{ alignItems: "flex-end" }}>
                <View style={{ marginVertical: 10 }}>
                    <MyText style={[styles.totalTaxt, {}]}>Tax Amount : {((item?.hourlyRate / 100 || 0) * item?.taxAmount).toFixed(2)}</MyText>
                    <MyText style={[styles.totalTaxt, {}]}>Total : {(item?.hourlyRate * item?.totalDuration).toFixed(2)}</MyText>
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
                            dispatch(updateTimeEntryField({ id: id, field: 'userObj', value: option }));
                            dispatch(updateTimeEntryField({ id: id, field: 'user', value: option.userProfileDTO?.fullName }));
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
                    dispatch(updateTimeEntryField({ id: id, field: 'date', value: moment(date).format('MM/DD/YYYY') }));
                    setSelectedDate(moment(date).format('MM/DD/YYYY'));
                    setIsDateOpen(false);
                    // setFieldValue('selectedDate', date?.toISOString())
                    // setFieldValue('isdueDate', false);
                    // setFieldValue(
                    //     'dueDate',
                    //     moment(date).format('MM/DD/YYYY'),
                    // );
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
                            dispatch(updateTimeEntryField({ id: id, field: 'tax', value: option.name }));
                            dispatch(updateTimeEntryField({ id: id, field: 'taxObj', value: option }));
                            dispatch(updateTimeEntryField({ id: id, field: 'taxAmount', value: option?.rate }));
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

export default BillingTimeEntry;

const styles = StyleSheet.create({
    totalTaxt: {
        fontSize: calculatefontSize(1.9)

    }
});
