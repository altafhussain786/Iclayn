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


const AddEmailAddress = ({ item, navigation }) => {
    const [isOpenUser, setisOpenUser] = useState(false);
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
            value: "others"
        },]



    const handleRemoveItem = () => {
        dispatch(removeTimeEntry({ id: id }));
    };




    return (
        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, paddingBottom: 15 }}>
            {/* Top Row: Delete + ReminderThrough */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>


                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenType(true)}>
                    <MyText style={{ color: item.date ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.date || 'Type'}
                    </MyText>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRemoveItem}>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>

            {/* Reminder Type Dropdown */}

            <View style={{ marginTop: 10 }}>
                <TextInput
                    placeholder="Email address"

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
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                <MyText style={styles.title}>Is Primary</MyText>
                <Switch
                    value={isSwitchOn}
                    onValueChange={(val) => setSwitchOn(val)}
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
                            // dispatch(updateTimeEntryField({ id: id, field: 'tax', value: option.name }));
                            // dispatch(updateTimeEntryField({ id: id, field: 'taxObj', value: option }));
                            // dispatch(updateTimeEntryField({ id: id, field: 'taxAmount', value: option?.rate }));
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

export default AddEmailAddress;

const styles = StyleSheet.create({
    totalTaxt: {
        fontSize: calculatefontSize(1.9)

    }
});
