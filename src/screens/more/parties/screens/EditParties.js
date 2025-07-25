import { Alert, AppState, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
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
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import { pick } from '@react-native-documents/picker'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import { COLORS, prefixList } from '../../../../constants'
import ScreenHeader from '../../../../components/ScreenHeader'
import TextInputWithTitle from '../../../../components/TextInputWithTitle'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import AddButton from '../../../../components/AddButton'
import AddEmailAddress from '../../../clients/components/AddEmailAddress'
import { addEmail, resetEmails } from '../../../../store/slices/clientSlice/createItemForAddEmail'
import AddPhoneNumber from '../../../clients/components/AddPhoneNumber'
import { addPhoneNumber, resetPhoneNumbers } from '../../../../store/slices/clientSlice/createItemForAddPhone'
import AddWebAddress from '../../../clients/components/AddWebAddress'
import { addWebAddress, resetWebAddresses } from '../../../../store/slices/clientSlice/createItemForWebAddress'
import AddAddress from '../../../clients/components/AddAddress'
import { addAddress, resetAddresses } from '../../../../store/slices/clientSlice/createItemForAddAddress'
import AddContactPerson from '../../../clients/components/AddContactPerson'
import { addContactPerson, resetContactPersons } from '../../../../store/slices/clientSlice/createItemForContactPerson'
import httpRequest from '../../../../api/apiHandler'


const EditParties = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const partiesDetails = route?.params?.partiesDetails;
    const items = useSelector(state => state.createItemForAddEmail.items);
    const itemsForPhoneNumber = useSelector(state => state.createItemForAddPhone.items);
    const itemsForWebAddress = useSelector(state => state.createItemForWebAddress.items);
    const itemsForAddAddress = useSelector(state => state.createItemForAddAddress.items);

    const [partyTypeData, setPartyTypeData] = useState([]);

    console.log(partiesDetails, "partiesdDetails===d=====>");
    console.log(partyTypeData, "partiesDedtails===d=====>");

    useEffect(() => {
        if (partiesDetails.partyEmailAddressDTOList?.length > 0) {

            partiesDetails.partyEmailAddressDTOList?.map((item, index) => {
                dispatch(addEmail({
                    id: Math.floor(Math.random() * 1000),
                    email: item?.email,
                    emailType: item?.type,
                    isEmailPrimary: item?.primary,
                    emailObj: item
                }));
            })
        }
        if (partiesDetails?.partyAddresseDTOList?.length > 0) {
            partiesDetails?.partyAddresseDTOList?.forEach(item => {
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


        //Phone Number
        if (partiesDetails.partyPhoneNumberDTOList?.length > 0) {

            partiesDetails.partyPhoneNumberDTOList?.map((item, index) => {
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

        if (partiesDetails.partyWebAddresseDTOList?.length > 0) {

            //Web address
            partiesDetails.partyWebAddresseDTOList?.map((item, index) => {
                dispatch(addWebAddress({
                    id: Math.floor(Math.random() * 1000),
                    webAddress: item.webAddress || '',
                    webAddressType: item.type || '',
                    isWebAddressPrimary: item.primary || false,
                    webAddressObj: item
                }));
            })

        }
    }, [partiesDetails])


    const getPartyTypeData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/pt/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setPartyTypeData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    useEffect(() => {
        getPartyTypeData();
    }, [])

    const validationSchema = Yup.object().shape({
    })

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={
                    {
                        isYourType: partiesDetails?.type || "Individual",

                        //individual===========================>
                        // party  ============>
                        party: partyTypeData?.find(item => item.partyTypeId === partiesDetails?.partyTypeId)?.name || "",
                        isPartyOpen: false,
                        // ============>
                        prefix: partiesDetails?.prefix || "",
                        isPrefixOpen: false,
                        // party END  ============>

                        firstName: partiesDetails?.firstName || "",
                        middleName: partiesDetails?.middleName || "",
                        lastName: partiesDetails?.lastName || "",

                        companyName: partiesDetails?.company || "",
                        title: partiesDetails?.title || "",

                        //Date of birth

                        dateOfBirth: moment(partiesDetails?.dob).format('DD/MM/YYYY') || moment().format('DD/MM/YYYY'),
                        selectedDateOfBirth: partiesDetails?.dob || moment(new Date()).toISOString(),
                        isdateOfBirthOpen: false,

                        // ========================>COMPANY ===>
                        companyName: partiesDetails?.companyName || "",
                        companyNumber: partiesDetails?.companyNumber || "",

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
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => {
                            dispatch(resetEmails())
                            dispatch(resetPhoneNumbers())
                            dispatch(resetWebAddresses())
                            dispatch(resetAddresses())
                            dispatch(resetContactPersons())
                            navigation.goBack()
                        }} isShowTitle={true} title="Edit Parties" />

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
                                        <MyText style={{ width: "70%" }}>Is the party an individual or a supplier ?</MyText>
                                        <View style={{ alignItems: "center", gap: 10 }}>
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
                                                <AntDesign name="camera" size={20} color={COLORS?.PRIMARY_COLOR} />

                                            </TouchableOpacity>

                                            <MyText style={{ flex: 1, fontSize: calculatefontSize(1.4) }}>
                                                Upload photo
                                            </MyText>
                                        </View>
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        {
                                            ["Individual", "Supplier"].map((item, index) => {
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

                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isPartyOpen', true)}
                                        title="party"
                                        isButton={true}
                                        buttonText={values.party ? values.party : 'Select party'}
                                    />
                                    {values?.isYourType !== "Individual" &&
                                        <>
                                            <TextInputWithTitle
                                                placeholder={"Party Company name"}
                                                isRequired={true}
                                                value={values.companyName}
                                                onChangeText={(txt) => setFieldValue('companyName', txt)}
                                                title="Party Company Name"

                                            />
                                            <TextInputWithTitle
                                                placeholder={"Party Company Number"}
                                                isRequired={true}
                                                value={values.companyNumber}
                                                onChangeText={(txt) => setFieldValue('companyNumber', txt)}
                                                title="Party Company Number"

                                            />
                                        </>
                                    }
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isPrefixOpen', true)}
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


                                    {/* ====================================> DROP DOWN MODAL <================================================= */}
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isPartyOpen', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('party', item?.name || '');
                                                    setFieldValue('isPartyOpen', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.name}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isPartyOpen}
                                        data={partyTypeData}
                                        searchKey="name"
                                    />
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isPrefixOpen', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('prefix', item?.value || '');
                                                    setFieldValue('isPrefixOpen', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.value}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isPrefixOpen}
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
            </Formik >

        </>
    )
}

export default EditParties

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