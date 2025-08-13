import { Alert, AppState, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Octicons from 'react-native-vector-icons/Octicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import { pick } from '@react-native-documents/picker'
import { calculatefontSize } from '../../../helper/responsiveHelper'
import { API_URL, COLORS, prefixList } from '../../../constants'
import ScreenHeader from '../../../components/ScreenHeader'
import TextInputWithTitle from '../../../components/TextInputWithTitle'
import Wrapper from '../../../components/Wrapper'
import MyText from '../../../components/MyText'
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch'
import AddButton from '../../../components/AddButton'
import AddEmailAddress from '../components/AddEmailAddress'
import { addEmail } from '../../../store/slices/clientSlice/createItemForAddEmail'
import AddPhoneNumber from '../components/AddPhoneNumber'
import { addPhoneNumber } from '../../../store/slices/clientSlice/createItemForAddPhone'
import AddWebAddress from '../components/AddWebAddress'
import { addWebAddress } from '../../../store/slices/clientSlice/createItemForWebAddress'
import AddAddress from '../components/AddAddress'
import { addAddress } from '../../../store/slices/clientSlice/createItemForAddAddress'
import AddContactPerson from '../components/AddContactPerson'
import { addContactPerson } from '../../../store/slices/clientSlice/createItemForContactPerson'
// import { pick } from '@react-native-documents/picker'


const TIMER_KEY = 'TIMEKEEPER_STATE';

const CreateClients = ({ navigation }) => {
    const toast = useToast();
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state?.userDetails?.userDetails);

    const items = useSelector(state => state.createItemForAddEmail.items);
    const itemsForPhoneNumber = useSelector(state => state.createItemForAddPhone.items);
    const itemsForWebAddress = useSelector(state => state.createItemForWebAddress.items);
    const itemsForAddAddress = useSelector(state => state.createItemForAddAddress.items);
    const itemsForContactPerson = useSelector(state => state.createItemForContactPerson.items);


    useEffect(() => {
    }, [])

    const validationSchema = Yup.object().shape({
    })

    return (
        <>
            <Formik
                // enableReinitialize
                initialValues={
                    {
                        isYourType: "Individual",

                        //individual===========================>
                        // prefix  ============>
                        prefix: "",
                        isOpenPrefix: false,
                        // prefix END  ============>

                        firstName: "",
                        middleName: "",
                        lastName: "",
                        companyName: "",
                        title: "",

                        //Date of birth

                        dateOfBirth: moment().format('DD/MM/YYYY'),
                        selectedDateOfBirth: moment(new Date()).toISOString(),
                        isdateOfBirthOpen: false,

                        // ========================>COMPANY ===>
                        companyName: "",
                        companyNumber: "",

                        //
                        documentFile: [],

                        //loader
                        loader: false
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(itemsForAddAddress, "itemsForAddAddress==>");
                    const token = await AsyncStorage.getItem('access_token')
                    const formData = new FormData();
                    const mappedItemForEmailAdd = items.map((i, index) => ({
                        createdOn: "",
                        updatedOn: null,
                        createdBy: null,
                        updatedBy: null,
                        revision: null,
                        clientEmailAddressId: null,
                        email: i?.email,
                        type: i?.emailType,
                        primary: i?.isEmailPrimary,
                        clientId: null
                    }))

                    const mappedItemForClientPhone = itemsForPhoneNumber.map((i, index) => ({
                        createdOn: "",
                        updatedOn: null,
                        createdBy: null,
                        updatedBy: null,
                        revision: null,
                        clientPhoneNumberId: null,
                        phoneNo: i?.phoneNumber,
                        type: i?.phoneNumberType,
                        primary: i?.isPhoneNumberPrimary,
                        clientId: null
                    }))

                    const mappedItemForWebAddress = itemsForWebAddress.map((i, index) => ({
                        createdOn: "",
                        updatedOn: null,
                        createdBy: null,
                        updatedBy: null,
                        revision: null,
                        clientWebAddresseId: null,
                        webAddress: i?.webAddress,
                        type: i?.webAddressType,
                        primary: i?.isWebAddressPrimary,
                        clientId: null
                    }))

                    const mappedItemForAddress = itemsForAddAddress.map((i, index) => ({
                        createdOn: "",
                        updatedOn: null,
                        createdBy: null,
                        updatedBy: null,
                        revision: null,
                        clientAddressId: null,
                        street: i?.streetAddress,
                        city: i?.city,
                        state: i?.stateAddress,
                        postCode: i?.postCode,
                        country: i?.country,
                        type: i?.type,
                        primary: i?.isAddressPrimary,
                        clientId: null
                    }))

                    const payload = {
                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails.userId,
                        updatedBy: null,
                        revision: null,
                        clientId: 0,
                        companyName: null,
                        companyNumber: null,
                        prefix: values?.prefix,
                        code: null,
                        firstName: values.firstName,
                        middleName: values.middleName,
                        lastName: values.lastName,
                        company: 'company Name',
                        title: values.title,
                        dob: values.selectedDateOfBirth,
                        status: "Active",
                        type: "Individual",
                        photo: null,
                        clientEmailAddressDTOList: mappedItemForEmailAdd || [],
                        clientPhoneNumberDTOList: mappedItemForClientPhone || [],
                        clientWebAddresseDTOList: mappedItemForWebAddress || [],
                        clientAddresseDTOList: mappedItemForAddress || [],
                        clientContactPersonDTOList: []
                    }
                    formData.append('data', JSON.stringify(payload));
                    // formData.append('data', {
                    //     string: JSON.stringify(payload), // RN ke kuch builds 'string' key chahte
                    //     type: 'application/json',
                    //     name: 'data.json',
                    // });
                    if (values?.documentFile?.uri) {
                        formData.append('photo', {
                            uri: values?.documentFile[0].uri, // local file uri
                            type: values?.documentFile[0].type, // e.g., image/jpeg
                            name: values?.documentFile[0].name,
                        });
                    }
                    console.log(payload, "payload", formData, "formdata");

                    setFieldValue('loader', true);
                    try {
                        const response = await fetch(`${API_URL}/ic/client/v1/create/`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                            body: formData,
                        });

                        const result = await response.json();
                        if (result?.data) {
                            toast.show('Log created successfully', { type: 'success' })
                            navigation.goBack()
                        }
                        else {
                            setFieldValue('loader', false);
                            toast.show('Something went wrong', { type: 'danger' })

                        }

                        console.log('Log:', result);
                    } catch (error) {
                        setFieldValue('loader', false);

                        console.error('Upload Error:', error);
                    }
                    setFieldValue('loader', false);



                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Client" />

                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // adjust as needed
                        >
                            <Wrapper>

                                <ScrollView
                                    contentContainerStyle={{ paddingBottom: 100 }} // extra space for keyboard
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
                                        <MyText style={{ width: "70%" }}>Is the client an individual or a company?</MyText>
                                        <View style={{ alignItems: "center", gap: 10 }}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    try {
                                                        const [pickResult] = await pick();

                                                        if (pickResult) {
                                                            setFieldValue('documentFile', [pickResult]);
                                                            // setFieldValue('documentFile', pickResult);
                                                        }
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                }}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
                                                    gap: 10,
                                                    borderStyle: "dashed",
                                                    borderWidth: 1,
                                                    padding: 10,
                                                    borderRadius: 30,
                                                }}
                                            >
                                                {values?.documentFile?.length > 0 ? <Image source={{ uri: values?.documentFile?.[0]?.uri }} style={{ height: 30, width: 30, resizeMode: "cover" }} /> : <AntDesign name="camera" size={20} color={COLORS?.PRIMARY_COLOR} />}

                                            </TouchableOpacity>

                                            <MyText style={{ flex: 1, fontSize: calculatefontSize(1.4) }}>
                                                Upload photo
                                            </MyText>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        {
                                            ["Individual", "Company"].map((item, index) => {
                                                const isSelected = values.isYourType === item;
                                                return (
                                                    <>
                                                        <TouchableOpacity style={{ width: "45%", }} onPress={() => setFieldValue('isYourType', item)}>
                                                            <LinearGradient
                                                                colors={isSelected ? [COLORS?.PRIMARY_COLOR_LIGHT, COLORS?.PRIMARY_COLOR,] : [COLORS?.LIGHT_COLOR, COLORS?.BORDER_LIGHT_COLOR,]}
                                                                start={{ x: 0, y: 0 }}
                                                                end={{ x: 1, y: 0 }}
                                                                style={{ padding: 10, borderRadius: 5, flexDirection: "row", alignItems: "center", gap: 10 }}
                                                            >
                                                                {item === "Individual" ? <AntDesign name={"user"} size={20} color={isSelected ? COLORS?.whiteColors : COLORS?.BLACK_COLOR} />
                                                                    :
                                                                    <Octicons name={"organization"} size={20} color={isSelected ? COLORS?.whiteColors : COLORS?.BLACK_COLOR} />}
                                                                <MyText style={{ textAlign: "center", color: isSelected ? COLORS?.whiteColors : COLORS?.BLACK_COLOR }}>{item}</MyText>
                                                            </LinearGradient>
                                                        </TouchableOpacity>
                                                    </>
                                                )
                                            })
                                        }

                                    </View>
                                    {

                                        <>
                                            {
                                                values?.isYourType === "Individual" ?
                                                    <>
                                                        <TextInputWithTitle
                                                            onPressButton={() => setFieldValue('isOpenPrefix', true)}
                                                            title="Prefix"
                                                            isButton={true}
                                                            buttonText={values.prefix ? values.prefix : 'Select Prefix'}
                                                        />
                                                        <TextInputWithTitle
                                                            placeholder={"First Name"}
                                                            value={values.firstName}
                                                            onChangeText={(txt) => setFieldValue('firstName', txt)}
                                                            title="FirstName"

                                                        />
                                                        <TextInputWithTitle
                                                            placeholder={"Middle Name"}
                                                            value={values.middleName}
                                                            onChangeText={(txt) => setFieldValue('middleName', txt)}
                                                            title="Middle Name"

                                                        />
                                                        <TextInputWithTitle
                                                            placeholder={"Last Name"}
                                                            value={values.lastName}
                                                            onChangeText={(txt) => setFieldValue('lastName', txt)}
                                                            title="Last Name"

                                                        />
                                                        <TextInputWithTitle
                                                            placeholder={"Title"}
                                                            value={values.title}
                                                            onChangeText={(txt) => setFieldValue('title', txt)}
                                                            title="Title"

                                                        />
                                                        <TextInputWithTitle
                                                            onPressButton={() => setFieldValue('isdateOfBirthOpen', true)}
                                                            title="Date of Birth"
                                                            isButton={true}
                                                            buttonText={values.dateOfBirth ? values.dateOfBirth : 'DD/MM/YYYY'}
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <TextInputWithTitle
                                                            placeholder={"Company name"}
                                                            isRequired={true}
                                                            value={values.companyName}
                                                            onChangeText={(txt) => setFieldValue('companyName', txt)}
                                                            title="Company Name"

                                                        />
                                                        <TextInputWithTitle
                                                            placeholder={"Company Number"}
                                                            isRequired={true}
                                                            value={values.companyNumber}
                                                            onChangeText={(txt) => setFieldValue('companyNumber', txt)}
                                                            title="Company Number"

                                                        />
                                                    </>
                                            }
                                            <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>

                                                {
                                                    items.map((item, index) => {
                                                        return (
                                                            <>
                                                                <AddEmailAddress item={item} index={index} navigation={navigation} />
                                                            </>
                                                        )
                                                    })

                                                }
                                                <AddButton onPress={() => dispatch(addEmail({
                                                    id: Math.floor(Math.random() * 1000),
                                                }))} title='Add email address' />
                                            </View>
                                            <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>

                                                {
                                                    itemsForPhoneNumber.map((item, index) => {
                                                        return (
                                                            <>
                                                                <AddPhoneNumber item={item} index={index} navigation={navigation} />
                                                            </>
                                                        )
                                                    })

                                                }
                                                <AddButton onPress={() => dispatch(addPhoneNumber({
                                                    id: Math.floor(Math.random() * 1000),
                                                }))} title='Add phone number' />
                                            </View>
                                            <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                                {
                                                    itemsForWebAddress.map((item, index) => {
                                                        return (
                                                            <>
                                                                <AddWebAddress item={item} index={index} navigation={navigation} />
                                                            </>
                                                        )
                                                    })
                                                }
                                                <AddButton onPress={() => dispatch(addWebAddress({
                                                    id: Math.floor(Math.random() * 1000),
                                                }))} title='Add Web Address' />
                                            </View>
                                            <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                                {
                                                    itemsForAddAddress.map((item, index) => {
                                                        return (
                                                            <>
                                                                <AddAddress item={item} index={index} navigation={navigation} />
                                                            </>
                                                        )
                                                    })
                                                }
                                                <AddButton onPress={() => dispatch(addAddress({
                                                    id: Math.floor(Math.random() * 1000),
                                                }))} title='Add address' />
                                            </View>
                                            {
                                                values?.isYourType !== "Individual" &&

                                                <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                                    {
                                                        itemsForContactPerson.map((item, index) => {
                                                            return (
                                                                <>
                                                                    <AddContactPerson item={item} index={index} navigation={navigation} />
                                                                </>
                                                            )
                                                        })
                                                    }
                                                    <AddButton onPress={() => dispatch(addContactPerson({
                                                        id: Math.floor(Math.random() * 1000),
                                                    }))} title='Add contact person' />
                                                </View>
                                            }
                                        </>

                                    }
                                    {/* ====================================> DROP DOWN MODAL <================================================= */}
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isOpenPrefix', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('prefix', item?.value || '');
                                                    setFieldValue('isOpenPrefix', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.value}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isOpenPrefix}
                                        data={prefixList}
                                        searchKey="value"
                                    />

                                    <DatePicker
                                        modal
                                        mode='date'
                                        open={values.isdateOfBirthOpen}
                                        date={new Date()}
                                        onConfirm={date => {
                                            setFieldValue('selectedDateOfBirth', date?.toISOString())
                                            setFieldValue('isdateOfBirthOpen', false);
                                            setFieldValue(
                                                'dateOfBirth',
                                                moment(date).format('MM/DD/YYYY'),
                                            );
                                        }}
                                        onCancel={() => {
                                            setFieldValue('isdateOfBirthOpen', false);
                                        }}
                                    />
                                </ScrollView>

                            </Wrapper>
                        </KeyboardAvoidingView>
                    </>

                )}
            </Formik>

        </>
    )
}

export default CreateClients

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#f0f0f0',
        width: '45%',
        borderRadius: 5,
    },
    btnTextStyle: {
        fontSize: calculatefontSize(1.9),
        fontWeight: '600',
        bottom: 10,
        color: COLORS?.PRIMARY_COLOR_LIGHT
    },
    itemStyle: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderColor: COLORS?.BORDER_LIGHT_COLOR
    },
})