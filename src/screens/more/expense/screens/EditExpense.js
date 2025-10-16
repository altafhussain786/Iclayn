import { Alert, AppState, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Field, Formik } from 'formik'
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
import { API_URL, COLORS } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import httpRequest from '../../../../api/apiHandler'
import { pick } from '@react-native-documents/picker'


const TIMER_KEY = 'TIMEKEEPER_STATE';

const EditExpense = ({ navigation, route }) => {
    const communicationDetails = route?.params?.communicationDetails;
    const [matterData, setmatterData] = React.useState([]);
    const [firmData, setfirmData] = React.useState([]);
    const [partyData, setPartyData] = React.useState([]);
    const [expenseData, setExpenseData] = React.useState([]);
    const [taxData, setTaxData] = React.useState([]);
    const userDetails = useSelector(state => state?.userDetails?.userDetails);

    //TIMMER
    const [defaultData, setDefaultData] = useState({});
    const toast = useToast()




    const getDefaultData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/exp-entry/${communicationDetails?.matterExpenseEntryId}`,
            navigation: navigation
        })
        if (res) {
            setDefaultData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    useEffect(() => {
        getDefaultData();
    }, [communicationDetails])




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

    console.log(defaultData, "=====d====d", taxData);

    return (
        <>
            <Formik
                enableReinitialize
                initialValues={
                    {
                        //matter details
                        matter: matterData?.find(user => user?.matterId === defaultData?.matterId)?.name || '',
                        matterObj: matterData?.find(user => user?.matterId === defaultData?.matterId) || {},
                        // matterObj: {},
                        isOpenmatter: false,

                        // expense Type ==>
                        expenseType: defaultData?.type == "DISBURSEMENT" ? "Disbursment" : 'Expense Recoveries', // default


                        //Party Data
                        party: partyData?.find(user => user?.partyId === defaultData?.partyId)?.companyName || '',
                        partyObj: partyData?.find(user => user?.partyId === defaultData?.partyId) || {},
                        isOpenParty: false,
                        // partyItems: [],

                        //expense Data
                        expense: expenseData?.find(user => user?.expCategoryId === defaultData?.categoryId)?.name || '',
                        expenseItems: expenseData?.find(user => user?.expCategoryId === defaultData?.categoryId) || [],
                        expenseObj: expenseData?.find(user => user?.expCategoryId === defaultData?.categoryId) || {},
                        isOpenexpense: false,

                        //Tax Data
                        tax: '',
                        taxItems: [],
                        taxObj: {},
                        isOpentax: false,

                        //Firm Data
                        firmData: firmData?.find(user => user?.userId === defaultData?.firmUserId)?.userProfileDTO?.fullName || "",
                        firmObj: firmData?.find(user => user?.userId === defaultData?.firmUserId) || {},
                        isOpenfirm: false,

                        //Date
                        date: moment(defaultData?.expDate).format('DD/MM/YYYY'),
                        selectedDate: defaultData?.expDate || moment().toISOString(),
                        isdateOpen: false,

                        description: defaultData?.description || '',

                        //rate
                        rate: defaultData?.amount || '',

                        nonBillable: defaultData?.nonBillable || false,
                        isShowEntryontheBill: defaultData?.visibleBill || false,


                        //Document

                        defaultFiles: defaultData?.matterExpenseEntryAttachmentDTOList || [], // API se aayi files
                        // defultFileUpdates:defaultData?.matterExpenseEntryAttachmentDTOList || [],
                        documentFile: [], // new upload hone wali files
                        documentsForShown: [
                            ...(defaultData?.matterExpenseEntryAttachmentDTOList || []),
                        ], // UI me dikhane ke liye dono mil kar

                        //loader
                        loader: false
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(values, "values==>");
                    const token = await AsyncStorage.getItem('access_token')
                    const payload = {
                        createdOn: defaultData?.createdOn || "",
                        updatedOn: defaultData?.updatedOn || null,
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        matterExpenseEntryId: defaultData?.matterExpenseEntryId,
                        matterId: values?.matterObj?.matterId || null,
                        matterName: values?.matterObj?.name || null,
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
                        matterExpenseEntryAttachmentDTOList: [], // sirf default
                    }
                    console.log(values?.matterObj, payload, "payload=======", defaultData, token);

                    const formdata = new FormData();
                    formdata.append('data', JSON.stringify(payload));
                    if (values?.documentFile.length) {

                        values.documentFile.forEach(file => {
                            formdata.append('attachment', {
                                uri: file.uri,
                                type: file.type,
                                name: file.name,
                            });
                        });
                    }

                    console.log(formdata, "=====================>");

                    try {
                        setFieldValue('loader', true);
                        const response = await fetch(`${API_URL}/ic/matter/exp-entry/v1`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                            body: formdata,
                        });

                        const result = await response.json();
                        console.log(result?.data, "======================>result?.data");

                        if (result?.data) {
                            toast.show('Expense Updated successfully', { type: 'success' })
                            setFieldValue('loader', true);

                            navigation.goBack();
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
                                    keyboardType='numeric'
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
                                <TextInputWithTitle value={values.description} onChangeText={(txt) => setFieldValue('description', txt)} title=" Description" placeholder={'Enter description'} />
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
                                                        setFieldValue('documentFile', [...values.documentFile, pickResult]);
                                                        setFieldValue('documentsForShown', [...values.documentsForShown, pickResult]);
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
                                    {values?.documentsForShown?.length > 0 && (
                                        <View style={{ gap: 10, }}>
                                            {values?.documentsForShown?.map((d, i) => (
                                                console.log(d, "dddddddddddddddd"),

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
                                                    {/* <MyText style={{ width: "70%" }}>{d?.name || 'Unnamed File'} {d?.uri}</MyText> */}
                                                    <Image source={{ uri: d?.uri || `data:image/jpeg;base64,${d?.attachment}` }} style={{ height: 100, width: 100 }} />
                                                    <TouchableOpacity

                                                        onPress={() => {
                                                            const fileToRemove = values.documentsForShown[i];

                                                            if (fileToRemove.attachmentId) {
                                                                // Default file
                                                                const updatedDefault = values.defaultFiles.filter(
                                                                    f => f.attachmentId !== fileToRemove.attachmentId
                                                                );
                                                                setFieldValue('defaultFiles', updatedDefault);
                                                            } else {
                                                                // New uploaded file
                                                                const updatedDocs = values.documentFile.filter(
                                                                    f => f.uri !== fileToRemove.uri
                                                                );
                                                                setFieldValue('documentFile', updatedDocs);
                                                            }

                                                            // Always remove from UI
                                                            const updatedShown = values.documentsForShown.filter(
                                                                (_, idx) => idx !== i
                                                            );
                                                            setFieldValue('documentsForShown', updatedShown);
                                                            // const fileToRemove = values.documentsForShown[i] || values.defaultFiles[i];
                                                            // if (fileToRemove.attachmentId) {
                                                            //     // 👇 Default file hai
                                                            //     const updatedDefault = values.defaultFiles.filter(
                                                            //         f => f.attachmentId !== fileToRemove.attachmentId
                                                            //     );
                                                            //     console.log(values.defaultFiles, "IF", updatedDefault);

                                                            //     setFieldValue('defaultFiles', updatedDefault);
                                                            // } else {
                                                            //     // 👇 New file hai
                                                            //     const updatedDocs = values.documentFile.filter(
                                                            //         f => f.uri !== fileToRemove.uri
                                                            //     );

                                                            //     console.log(values.defaultFiles, "ELSE", updatedDocs);

                                                            //     setFieldValue('documentFile', updatedDocs);
                                                            // }

                                                            // // 👇 UI se remove karna
                                                            // const updatedShown = values.documentsForShown.filter((_, idx) => idx !== i);
                                                            // console.log(values.defaultFiles, "Bahir", updatedShown);

                                                            // setFieldValue('documentsForShown', updatedShown);
                                                        }}
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
            </Formik >

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