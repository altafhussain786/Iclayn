import { Alert, AppState, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import ScreenHeader from '../../../../components/ScreenHeader'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import TextInputWithTitle from '../../../../components/TextInputWithTitle'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import { COLORS } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import httpRequest from '../../../../api/apiHandler'
import { pick } from '@react-native-documents/picker'


const TIMER_KEY = 'TIMEKEEPER_STATE';

const EditExpense = ({ navigation }) => {
    const [matterData, setmatterData] = React.useState([]);
    const [firmData, setfirmData] = React.useState([]);
    const [partyData, setPartyData] = React.useState([]);
    const [expenseData, setExpenseData] = React.useState([]);
    const [taxData, setTaxData] = React.useState([]);
    const userDetails = useSelector(state => state?.userDetails?.userDetails);

    //TIMMER
    const toast = useToast()


    const getMatterData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/listing`,
            navigation: navigation
        })
        if (res) {
            setmatterData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getPartyData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/party/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setPartyData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getTaxData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/tax/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setTaxData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getExpenseData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/exp-category/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setExpenseData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getfirmData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res?.data, "==>BIILLLIND DATA");

            setfirmData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }
    useEffect(() => {
        getExpenseData()
        getPartyData()
        getTaxData()
        getMatterData()
        getfirmData()
    }, [])

    const validationSchema = Yup.object().shape({
        matter: Yup.string().required('matter is required'),
        firmData: Yup.string().required('User is required'),

        rate: Yup.string().required('rate is required'),

    })

    return (
        <>
            <Formik
                // enableReinitialize
                initialValues={
                    {
                        //matter details
                        matter: '',
                        matterItems: [],
                        matterObj: {},
                        isOpenmatter: false,

                        // expense Type ==>
                        expenseType: 'Disbursment', // default


                        //Party Data
                        party: '',
                        partyItems: [],
                        partyObj: {},
                        isOpenParty: false,

                        //expense Data
                        expense: '',
                        expenseItems: [],
                        expenseObj: {},
                        isOpenexpense: false,

                        //Tax Data
                        tax: '',
                        taxItems: [],
                        taxObj: {},
                        isOpentax: false,

                        //Firm Data
                        firmData: "",
                        firmItems: [],
                        firmObj: {},
                        isOpenfirm: false,

                        //Date
                        date: moment().format('DD/MM/YYYY'),
                        selectedDate: moment(new Date()).toISOString(),
                        isdateOpen: false,

                        description: '',

                        //rate
                        rate: '',

                        nonBillable: false,
                        isShowEntryontheBill: false,

                        //Document
                        documentFile: [],
                        //loader
                        loader: false
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(values, "values==>");
                    const payload = {
                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        matterExpenseEntryId: 0,
                        matterId: values?.matterObj?.matterId || null,
                        expDate: values?.selectedDate,
                        categoryId: values?.expenseObj?.expCategoryId || null,
                        category: values?.expenseObj?.name || null,
                        firmUserId: values?.firmObj?.userId || null,
                        amount: values?.rate || 0,
                        taxId: values?.taxObj?.taxId || null,
                        taxRate: values?.taxObj?.rate || null,
                        partyId: values?.partyObj?.partyId || null,
                        nonBillable: values?.nonBillable || false,
                        visibleBill: values?.isShowEntryontheBill || false,
                        description: values?.description || "",
                        billed: false,
                        type: values?.expenseType == "Disbursment" ? "DISBURSEMENT" : "RECOVERIES",
                        matterExpenseEntryAttachmentDTOList: null,
                    }
                    console.log(payload, "payload=======");

                    const formdata = new FormData();
                    let jsonString = JSON.stringify(payload);
                    formdata.append('data', new Blob([jsonString], { type: 'application/json' }));
                    if (values?.documentFile.length) {

                        values?.documentFile?.map(v => (
                            // formdata.append("attachment", v)
                            formdata.append('attachment', {
                                // uri: v.uri,
                                // type: v.type, // You may want to determine this dynamically
                                filename: v.name, // You can also use original file name
                            })
                        ));
                    }
                    const { res, err } = await httpRequest({
                        method: "put",
                        path: "/ic/matter/exp-entry/",
                        params: formdata,
                        header: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    if (res) {
                        toast.show('Expense added successfully', { type: 'success' })
                    }
                    else {
                        toast.show(err?.message, { type: 'danger' })
                    }

                    //         {
                    //             "createdOn": "",
                    // "updatedOn": null,
                    // "createdBy": 1,
                    // "updatedBy": null,
                    // "revision": null,
                    // "matterExpenseEntryId": null,
                    // "matterId": 5,
                    // "expDate": "2025-07-23T12:57:23.758Z",
                    // "categoryId": 1,
                    // "category": "Stamp papers fee",
                    // "firmUserId": 1,
                    // "amount": 30,
                    // "taxId": 1,
                    // "taxRate": 20,
                    // "partyId": 3,
                    // "nonBillable": false,
                    // "visibleBill": false,
                    // "description": "dfsd",
                    // "billed": false,
                    // "type": "DISBURSEMENT",
                    // "matterExpenseEntryAttachmentDTOList": null
                    // }


                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Edit Expense" />
                        <Wrapper>
                            <ScrollView
                                contentContainerStyle={{ paddingBottom: 50 }}
                                keyboardShouldPersistTaps="handled"
                                showsVerticalScrollIndicator={false}
                            >
                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpenmatter', true)}
                                    title="Matter"
                                    isButton={true}
                                    buttonText={values.matter ? values.matter : 'Select Matter'}
                                />
                                <View style={{ marginVertical: 15 }}>
                                    <MyText style={{ marginBottom: 8 }}>Expense type</MyText>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                                        {['Disbursment', 'Expense Recoveries'].map(type => {
                                            const isSelected = values.expenseType === type;
                                            return (
                                                <TouchableOpacity
                                                    key={type}
                                                    activeOpacity={0.9}
                                                    onPress={() => setFieldValue('expenseType', type)}
                                                    style={{ width: '48%', }}
                                                >
                                                    <LinearGradient
                                                        colors={
                                                            isSelected
                                                                ? [COLORS.PRIMARY_COLOR, COLORS.PRIMARY_COLOR_LIGHT]
                                                                : ['#E0E0E0', '#F5F6F8']
                                                        }
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        style={styles.linearGradient}
                                                    >
                                                        <View>
                                                            <MyText
                                                                style={{
                                                                    fontWeight: 'bold',
                                                                    fontSize: 16,
                                                                    color: isSelected ? COLORS.whiteColors : COLORS.BLACK_COLOR,
                                                                    textAlign: 'center',
                                                                }}
                                                            >
                                                                {type}
                                                            </MyText>
                                                            <MyText
                                                                style={{
                                                                    fontSize: 12,
                                                                    color: isSelected ? COLORS.whiteColors : COLORS.BLACK_COLOR,
                                                                    marginTop: 8,
                                                                    textAlign: 'center',
                                                                    lineHeight: 16,
                                                                }}
                                                            >
                                                                {type === 'Disbursement'
                                                                    ? 'Expenses that need to be paid to a party on the client’s behalf (e.g., court fees)'
                                                                    : 'Expenses not directly associated with a party payment (e.g., photocopies)'}
                                                            </MyText>
                                                        </View>
                                                    </LinearGradient>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>

                                </View>



                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpenfirm', true)}
                                    title="Firm User"
                                    isRequired={true}
                                    isButton={true}
                                    buttonText={values.firmData ? values.firmData : 'Select Firm user'}
                                />
                                {
                                    errors.firmData && touched.firmData && <MyText style={{ color: 'red' }}>{errors.firmData}</MyText>
                                }
                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isdateOpen', true)}
                                    title="Date"
                                    isButton={true}
                                    buttonText={values.date ? values.date : 'Select Open date'}
                                />

                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpenParty', true)}
                                    title="Party"
                                    isRequired={true}
                                    isButton={true}
                                    buttonText={values.party ? values.party : 'Select a Party'}
                                />
                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpenexpense', true)}
                                    title="Expense"
                                    isRequired={true}
                                    isButton={true}
                                    buttonText={values.expense ? values.expense : 'Select a expense'}
                                />
                                <TextInputWithTitle
                                    placeholder={'Amount'}
                                    title="Amount"
                                    isRequired={true}
                                    onChangeText={(txt) => setFieldValue('rate', txt)}
                                    value={values.rate?.toString()}
                                />
                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpentax', true)}
                                    title="Tax"
                                    isRequired={true}
                                    isButton={true}
                                    buttonText={values.tax ? values.tax : 'Select a tax'}
                                />
                                {
                                    errors.rate && touched.rate && <MyText style={{ color: 'red' }}>{errors.rate}</MyText>
                                }
                                <TextInputWithTitle onChangeText={(txt) => setFieldValue('description', txt)} title=" Description" placeholder={'Enter description'} />
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>

                                    <MyText style={styles.title}>Non-billable</MyText>
                                    <Switch
                                        value={values.nonBillable}
                                        onValueChange={(val) => {
                                            if (values.nonBillable) {
                                                setFieldValue('isShowEntryontheBill', false)
                                                setFieldValue('nonBillable', val)
                                            }
                                            else {
                                                setFieldValue('nonBillable', val)

                                            }
                                        }}
                                        thumbColor={values.nonBillable ? "#ffffff" : "#ffffff"}
                                        trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                                    />
                                </View>

                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>

                                    <MyText style={[styles.title, { color: values.nonBillable ? COLORS?.BLACK_COLOR : COLORS?.LIGHT_COLOR }]}>Show this entry on the bill</MyText>
                                    <Switch
                                        disabled={!values.nonBillable}
                                        value={values.isShowEntryontheBill}
                                        onValueChange={(val) => setFieldValue('isShowEntryontheBill', val)}
                                        thumbColor={values.isShowEntryontheBill ? "#ffffff" : "#ffffff"}
                                        trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                                    />
                                </View>
                                <View style={{ gap: 10, marginVertical: 10, padding: 15 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
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
                                                borderRadius: 5,
                                            }}
                                        >
                                            <AntDesign name="upload" size={15} color={COLORS?.BLACK_COLOR} />
                                            <MyText>Upload File</MyText>
                                        </TouchableOpacity>

                                        <MyText style={{ flex: 1, fontSize: calculatefontSize(1.4) }}>
                                            You can upload a maximum of 5 files, 5MB each
                                        </MyText>
                                    </View>

                                    {/* Uploaded Files List */}
                                    {values?.documentFile?.length > 0 && (
                                        <View style={{ gap: 10, }}>
                                            {values?.documentFile?.map((d, i) => (
                                                <View
                                                    key={i}
                                                    style={{
                                                        flexDirection: "row",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                        padding: 10,
                                                        backgroundColor: '#f5f5f5',
                                                        borderRadius: 5,
                                                    }}
                                                >
                                                    <MyText style={{ width: "70%" }}>{d?.name || 'Unnamed File'}</MyText>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setFieldValue(
                                                                'documentFile',
                                                                values?.documentFile?.filter((_, index) => index !== i)
                                                            )
                                                        }
                                                    >
                                                        <Entypo name="circle-with-cross" size={20} color="red" />
                                                    </TouchableOpacity>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                                {/* ///////////////////////////////BOTTOM MODAL ///////////////////////////// */}
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenmatter', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('matterObj', item);
                                                setFieldValue('matter', item?.name || '');
                                                setFieldValue('isOpenmatter', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenmatter}
                                    data={matterData}
                                    searchKey="name"
                                />

                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenfirm', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('rate', item?.userProfileDTO?.billingRate || '');
                                                setFieldValue('firmObj', item);
                                                setFieldValue('firmData', item?.userProfileDTO?.fullName || '');
                                                setFieldValue('isOpenfirm', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                {item?.userProfileDTO?.fullName}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenfirm}
                                    data={firmData}
                                    searchKey="email"
                                />
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenParty', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('partyObj', item);
                                                setFieldValue('party', item?.companyName ? item?.companyName : `${item?.firstName + " " + item?.lastName}` || '');
                                                setFieldValue('isOpenParty', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                {item?.companyName ? item?.companyName : `${item?.firstName + " " + item?.lastName}`}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenParty}
                                    data={partyData}
                                    searchKey="firstName"
                                />
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenexpense', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('expenseObj', item);
                                                setFieldValue('expense', item?.name);
                                                setFieldValue('isOpenexpense', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenexpense}
                                    data={expenseData?.filter(item => item?.type == values?.expenseType)}
                                    searchKey="name"
                                />
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpentax', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('taxObj', item);
                                                setFieldValue('tax', item?.name);
                                                setFieldValue('isOpentax', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpentax}
                                    data={taxData}
                                    searchKey="name"
                                />
                                <DatePicker
                                    modal
                                    mode='date'
                                    open={values.isdateOpen}
                                    date={new Date()}
                                    onConfirm={date => {
                                        setFieldValue('selectedDate', date?.toISOString())
                                        setFieldValue('isdateOpen', false);
                                        setFieldValue(
                                            'date',
                                            moment(date).format('MM/DD/YYYY'),
                                        );
                                    }}
                                    onCancel={() => {
                                        setFieldValue('isdateOpen', false);
                                    }}
                                />
                            </ScrollView>

                        </Wrapper>
                    </>

                )}
            </Formik>

        </>
    )
}

export default EditExpense

const styles = StyleSheet.create({


    itemStyle: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderColor: COLORS?.BORDER_LIGHT_COLOR
    },
    linearGradient: {
        padding: 15,
        borderRadius: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        minHeight: 130, // force equal height
        justifyContent: 'space-between',
    }
})