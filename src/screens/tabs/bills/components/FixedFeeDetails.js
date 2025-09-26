import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import MyText from '../../../../components/MyText';
import { COLORS, fontFamily } from '../../../../constants';
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
import { calculatefontSize } from '../../../../helper/responsiveHelper';
import httpRequest from '../../../../api/apiHandler';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { removeFixedFee, updateFixedFeeField } from '../../../../store/slices/billingSlice/createFixedFeeDetailItem';



const FixedFeeDetails = ({ item, navigation }) => {
    const [isOpenUser, setisOpenUser] = useState(false);
    const [isOpenTax, setisOpenTax] = useState(false);
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [taxData, setTaxData] = useState([]);

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
        dispatch(removeFixedFee({ id: id }));
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
                    onChangeText={(txt) => dispatch(updateFixedFeeField({ id: id, field: 'description', value: txt }))}

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
                    placeholder="Amount"
                    keyboardType='numeric'
                    value={String(item?.hourlyRate || '')}
                    onChangeText={(txt) => dispatch(updateFixedFeeField({ id: id, field: 'hourlyRate', value: txt }))}
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
                    {(() => {
                        const rate = Number(item?.hourlyRate || 0);
                        const taxPercentage = Number(item?.taxAmount || 0);

                        // agar totalDuration available hai to timeEntry hai, warna fixed fee
                        const duration = item?.totalDuration !== undefined ? Number(item?.totalDuration) : null;

                        const lineTotal = duration !== null ? rate * duration : rate;
                        const lineTax = (lineTotal * taxPercentage) / 100;
                        const grandTotal = lineTotal + lineTax;

                        return (
                            <>
                                {/* Total amount before tax */}
                                <MyText style={styles.totalTaxt}>
                                    Total : {lineTotal.toFixed(2)}
                                </MyText>

                                {/* Tax amount */}
                                <MyText style={styles.totalTaxt}>
                                    Tax Amount : {lineTax.toFixed(2)}
                                </MyText>

                                {/* Grand total (with tax) */}
                                <MyText style={styles.totalTaxt}>
                                    Grand Total : {grandTotal.toFixed(2)}
                                </MyText>
                            </>
                        );
                    })()}
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
                            dispatch(updateFixedFeeField({ id: id, field: 'userObj', value: option }));
                            dispatch(updateFixedFeeField({ id: id, field: 'user', value: option.userProfileDTO?.fullName }));
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
                    dispatch(updateFixedFeeField({ id: id, field: 'date', value: moment(date).format('MM/DD/YYYY') }));
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
                            dispatch(updateFixedFeeField({ id: id, field: 'tax', value: option.name }));
                            dispatch(updateFixedFeeField({ id: id, field: 'taxObj', value: option }));
                            dispatch(updateFixedFeeField({ id: id, field: 'taxAmount', value: option?.rate }));
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

export default FixedFeeDetails;

const styles = StyleSheet.create({
    totalTaxt: {
        fontSize: calculatefontSize(1.9)

    }
});
