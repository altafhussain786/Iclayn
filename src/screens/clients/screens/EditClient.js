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
import { COLORS, prefixList } from '../../../constants'
import ScreenHeader from '../../../components/ScreenHeader'
import TextInputWithTitle from '../../../components/TextInputWithTitle'
import Wrapper from '../../../components/Wrapper'
import MyText from '../../../components/MyText'
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch'
import AddButton from '../../../components/AddButton'
import AddEmailAddress from '../components/AddEmailAddress'
import { addEmail, resetEmails } from '../../../store/slices/clientSlice/createItemForAddEmail'
import AddPhoneNumber from '../components/AddPhoneNumber'
import { addPhoneNumber, resetPhoneNumbers } from '../../../store/slices/clientSlice/createItemForAddPhone'
import AddWebAddress from '../components/AddWebAddress'
import { addWebAddress, resetWebAddresses } from '../../../store/slices/clientSlice/createItemForWebAddress'
import AddAddress from '../components/AddAddress'
import { addAddress, resetAddresses } from '../../../store/slices/clientSlice/createItemForAddAddress'
import AddContactPerson from '../components/AddContactPerson'
import { addContactPerson, resetContactPersons } from '../../../store/slices/clientSlice/createItemForContactPerson'
import httpRequest from '../../../api/apiHandler'
import Loader from '../../../components/Loader'
import LoaderModal from '../../../components/LoaderModal'
// import { pick } from '@react-native-documents/picker'




const EditClient = ({ navigation, route }) => {
    const clientData = route?.params?.clientData
    const [defaultData, setDefaultData] = useState({});
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const items = useSelector(state => state.createItemForAddEmail.items);
    const itemsForPhoneNumber = useSelector(state => state.createItemForAddPhone.items);
    const itemsForWebAddress = useSelector(state => state.createItemForWebAddress.items);
    const itemsForAddAddress = useSelector(state => state.createItemForAddAddress.items);
    const itemsForContactPerson = useSelector(state => state.createItemForContactPerson.items);


    console.log(clientData, "clientData=====>");


    const getDefaultData = async () => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/client/${clientData?.clientId}`,
            navigation: navigation
        })
        if (res) {
            setDefaultData(res?.data);
            //Email Details
            if (res?.data?.clientEmailAddressDTOList?.length > 0) {

                res?.data?.clientEmailAddressDTOList?.map((item, index) => {
                    dispatch(addEmail({
                        id: Math.floor(Math.random() * 1000),
                        email: item?.email,
                        emailType: item?.type,
                        isEmailPrimary: item?.primary,
                        emailObj: item
                    }));
                })
            }
            //Phone Number
            if (res?.data?.clientPhoneNumberDTOList?.length > 0) {

                res?.data?.clientPhoneNumberDTOList?.map((item, index) => {
                    dispatch(addPhoneNumber({
                        id: Math.floor(Math.random() * 1000),
                        phoneNumber: item.phoneNo || '',
                        phoneNumberType: item.type || '',
                        pickerDetails: '',
                        isPhoneNumberPrimary: item.primary || false,
                        phoneNumberObj: item
                    }));
                })

            }

            if (res?.data?.clientWebAddresseDTOList?.length > 0) {

                //Web address
                res?.data?.clientWebAddresseDTOList?.map((item, index) => {
                    dispatch(addWebAddress({
                        id: Math.floor(Math.random() * 1000),
                        webAddress: item.webAddress || '',
                        webAddressType: item.type || '',
                        isWebAddressPrimary: item.primary || false,
                        webAddressObj: item
                    }));
                })

            }



            if (res?.data?.clientAddresseDTOList?.length > 0) {

                //address
                res?.data?.clientAddresseDTOList?.map((item, index) => {
                    dispatch(addAddress({
                        id: Math.floor(Math.random() * 1000),
                        country: item.country || '',
                        countryObj: item.countryObj || {},
                        city: item.city || '',
                        cityObj: item.cityObj || {},
                        type: item.type || '',
                        stateAddress: item.state || '',
                        postCode: item.postCode || '',
                        streetAddress: item.street || '',
                        isAddressPrimary: item.primary || false,
                        addressObj: item
                    }));
                })

            }
            if (res?.data?.clientContactPersonDTOList?.length > 0) {
                res?.data?.clientContactPersonDTOList?.map((item, index) => {
                    dispatch(addContactPerson({
                        prefixName: item.prefix || '',
                        type: item.type || '',
                        firstName: item.firstName || '',
                        middleName: item.middleName || '',
                        lastName: item.lastName || '',
                        email: item.email || '',
                        phoneNumber: item.phoneNo || '',
                        isContactPersonPrimary: item.primary || false,
                        contactPersonObj: item
                    }));
                })
            }
            setLoader(false)


        }
        else {
            setLoader(false)

            console.log('err', err);
        }


    }

    useEffect(() => {
        getDefaultData();
    }, [clientData])

    const validationSchema = Yup.object().shape({
    })


    const imageURL = `data:image/jpeg;base64,${defaultData?.photo}`;


    return (
        <>
            <Formik
                enableReinitialize
                initialValues={
                    {
                        isYourType: defaultData?.type || "Individual",

                        //individual===========================>
                        // prefix  ============>
                        prefix: "",
                        isOpenPrefix: false,
                        // prefix END  ============>

                        firstName: defaultData?.firstName || '',
                        middleName: defaultData?.middleName || "",
                        lastName: defaultData?.lastName || "",
                        company: defaultData?.company || "",
                        title: defaultData?.title || "",

                        //Date of birth

                        dateOfBirth: moment(defaultData?.dob).format('DD/MM/YYYY') || moment().format('DD/MM/YYYY'),
                        selectedDateOfBirth: defaultData?.dob || moment(new Date()).toISOString(),
                        isdateOfBirthOpen: false,

                        // ========================>COMPANY ===>
                        companyName: defaultData?.companyName || "",
                        companyNumber: defaultData?.companyNumber || "",

                        //
                        documentFile: '',

                        //loader
                        loader: false
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(values, "values==>");


                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <LoaderModal visible={loader} />
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => {
                            dispatch(resetEmails())
                            dispatch(resetPhoneNumbers())
                            dispatch(resetWebAddresses())
                            dispatch(resetAddresses())
                            dispatch(resetContactPersons())
                            navigation.goBack()
                        }} isShowTitle={true} title="Edit Client" />

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
                                            {defaultData?.photo ?
                                                <TouchableOpacity
                                                    onPress={async () => {
                                                        try {
                                                            const [pickResult] = await pick();

                                                            if (pickResult) {
                                                                setFieldValue('documentFile', [...(values?.documentFile || []), pickResult]);
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
                                                    <Image source={{ uri: imageURL }} style={{ height: 40, width: 40, borderRadius: 50, }} />
                                                </TouchableOpacity>
                                                : <TouchableOpacity
                                                    onPress={async () => {
                                                        try {
                                                            const [pickResult] = await pick();

                                                            if (pickResult) {
                                                                setFieldValue('documentFile', [...(values?.documentFile || []), pickResult]);
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
                                                    <AntDesign name="camera" size={20} color={COLORS?.PRIMARY_COLOR} />
                                                </TouchableOpacity>
                                            }

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
                                                            placeholder={"Company"}
                                                            // isRequired={true}
                                                            value={values.company}
                                                            onChangeText={(txt) => setFieldValue('company', txt)}
                                                            title="Company"

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

export default EditClient

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