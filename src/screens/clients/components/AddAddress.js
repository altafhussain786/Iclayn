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
import httpRequest from '../../../api/apiHandler';
import { removeAddress, updateAddressField } from '../../../store/slices/clientSlice/createItemForAddAddress';


const AddAddress = ({ item, navigation }) => {
    const [isOpenUser, setisOpenUser] = useState(false);
    ///COuntry
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [selectCountry, setSelectCountry] = useState({});
    const [countryId, setCountryId] = useState(1);
    //dsfhldsf

    //city
    const [isOpenCity, setisOpenCity] = useState(false);
    const [cityData, setCityData] = useState([]);

    const [selectCity, setSelectCity] = useState({});
    //ENd
    const [isOpenType, setisOpenType] = useState(false);
    const [isSwitchOn, setSwitchOn] = useState(false);
    const dispatch = useDispatch();
    const id = item?.id;

    const getCountryData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/locale/country`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "country data");

            setCountryData(res?.data);

        }
        else {
            console.log('err', err);
        }
    }
    const getCityData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/locale/city/country/${countryId}`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "country data");

            setCityData(res?.data);

        }
        else {
            console.log('err', err);
        }
    }

    useEffect(() => {
        getCityData()
    }, [countryId])


    useEffect(() => {

        getCountryData()
    }, [])


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
        dispatch(removeAddress({ id: id }));
    };

    return (
        <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, paddingBottom: 15 }}>
            {/* Top Row: Delete + ReminderThrough */}
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>


                <TouchableOpacity style={{ width: '85%' }} onPress={() => setIsCountryOpen(true)}>
                    <MyText style={{ color: item.country ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.country || 'Select Country'}
                    </MyText>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRemoveItem}>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: '#ddd', borderRadius: 5, marginTop: 10 }}>

                <TouchableOpacity style={{ width: '85%' }} onPress={() => setisOpenCity(true)}>
                    <MyText style={{ color: item.city ? COLORS?.PRIMARY_COLOR : COLORS?.LIGHT_COLOR }}>
                        {item?.city || 'Select City'}
                    </MyText>
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
                    value={item?.stateAddress}
                    placeholder="State "
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateAddressField({ id: id, field: 'stateAddress', value: txt }))}
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
                    value={item?.postCode}
                    placeholder="Post Code"
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateAddressField({ id: id, field: 'postCode', value: txt }))}
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
                    value={item?.streetAddress}
                    placeholder="Street Address"
                    placeholderTextColor={COLORS?.LIGHT_COLOR}
                    onChangeText={(txt) => dispatch(updateAddressField({ id: id, field: 'streetAddress', value: txt }))}
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
                    value={item?.isAddressPrimary}
                    onValueChange={(val) => { setSwitchOn(val), dispatch(updateAddressField({ id: id, field: 'isAddressPrimary', value: val })) }}
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
                            dispatch(updateAddressField({ id: id, field: 'type', value: option.name }));
                            setisOpenType(false);
                        }}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.BORDER_LIGHT_COLOR }}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>{option.name}</MyText>
                    </TouchableOpacity>
                )}
            />
            <BottomModalListWithSearch
                onClose={() => setIsCountryOpen(false)}
                visible={isCountryOpen}
                data={countryData}
                searchKey="name"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            console.log(option, "option==================>");
                            setCountryId(option.countryId);
                            dispatch(updateAddressField({ id: id, field: 'country', value: option.name }));
                            dispatch(updateAddressField({ id: id, field: 'countryObj', value: option }));
                            setIsCountryOpen(false);
                        }}
                        style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: COLORS.BORDER_LIGHT_COLOR }}
                    >
                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>{option.name}</MyText>
                    </TouchableOpacity>
                )}
            />
            <BottomModalListWithSearch
                onClose={() => setisOpenCity(false)}
                visible={isOpenCity}
                data={cityData}
                searchKey="name"
                renderItem={({ item: option }) => (
                    <TouchableOpacity
                        onPress={() => {
                            dispatch(updateAddressField({ id: id, field: 'city', value: option.name }));
                            dispatch(updateAddressField({ id: id, field: 'cityObj', value: option }));
                            // dispatch(updateAddressField({ id: id, field: 'webAddressType', value: option.name }));
                            setisOpenCity(false);
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

export default AddAddress;

const styles = StyleSheet.create({
    totalTaxt: {
        fontSize: calculatefontSize(1.9)

    }
});
