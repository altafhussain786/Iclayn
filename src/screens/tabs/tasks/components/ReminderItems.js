import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import MyText from '../../../../components/MyText';
import { COLORS } from '../../../../constants';
import { removeReminderItem, updateReminderThrough, updateReminderType, updateCounts } from '../../../../store/slices/taskSlice/createItemforReminder';
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
import { calculatefontSize } from '../../../../helper/responsiveHelper';



const ReminderItems = ({ item }) => {
    const [isOpenReminderThrough, setIsOpenReminderThrough] = useState(false);
    const [isOpenReminderType, setIsOpenReminderType] = useState(false);

    const dispatch = useDispatch();
    const RID = item?.rId;

    const reminderThroughOptions = [
        { label: 'Email', value: 'email' },
        { label: 'Call', value: 'call' }
    ];

    const reminderTypeOptions = [
        { label: 'Minutes', value: 'minutes' },
        { label: 'Hours', value: 'hours' },
        { label: 'Days', value: 'days' }
    ];

    const handleRemoveItem = () => {
        dispatch(removeReminderItem({ rId: RID }));
    };

    return (
        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, paddingBottom: 15 }}>
            {/* Top Row: Delete + ReminderThrough */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8,    borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>
                <TouchableOpacity onPress={handleRemoveItem}>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsOpenReminderThrough(true)}>
                    <MyText style={{ color: item.reminderThrough ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.reminderThrough || 'Reminder Through'}
                    </MyText>
                </TouchableOpacity>
            </View>

            {/* Reminder Type Dropdown */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8,    borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>
                <TouchableOpacity onPress={() => setIsOpenReminderType(true)}>
                    <MyText style={{ color: item.reminderType ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.reminderType || 'Reminder Type'}
                    </MyText>
                </TouchableOpacity>
            </View>

            {/* Counts Input */}
            <View style={{ marginTop: 10 }}>
                <TextInput
                    placeholder="Enter Count"
                    keyboardType="numeric"
                    value={String(item?.counts || '')}
                    onChangeText={(txt) => dispatch(updateCounts({ rId: RID, counts: parseInt(txt || 0) }))}
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

            {/* Reminder Through Modal */}
            <BottomModalListWithSearch
                onClose={() => setIsOpenReminderThrough(false)}
                visible={isOpenReminderThrough}
                data={reminderThroughOptions}
                searchKey="label"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updateReminderThrough({ rId: RID, reminderThrough: option.value }));
                            setIsOpenReminderThrough(false);
                        }}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.BORDER_LIGHT_COLOR }}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>{option.label}</MyText>
                    </TouchableOpacity>
                )}
            />

            {/* Reminder Type Modal */}
            <BottomModalListWithSearch
                onClose={() => setIsOpenReminderType(false)}
                visible={isOpenReminderType}
                data={reminderTypeOptions}
                searchKey="label"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updateReminderType({ rId: RID, reminderType: option.value }));
                            setIsOpenReminderType(false);
                        }}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.BORDER_LIGHT_COLOR }}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>{option.label}</MyText>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default ReminderItems;

const styles = StyleSheet.create({});
