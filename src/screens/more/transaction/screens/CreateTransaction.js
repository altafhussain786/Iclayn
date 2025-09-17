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
import httpRequest from '../../../../api/apiHandler'
import AddButton from '../../../../components/AddButton'



const CreateTransaction = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails
    const dispatch = useDispatch();
    const userDetails = useSelector(state => state?.userDetails?.userDetails);
    const toast = useToast()

    const [matterData, setmatterData] = useState([]);
    const [matterId, setMatterId] = useState('');
    const [clientData, setClientData] = useState([]);

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
    const getClientData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/${matterId}/client`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "CLIENT=d===>");

            setClientData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    useEffect(() => {
        getClientData();
    }, [matterId])


    useEffect(() => {
        getMatterData();
    }, [])

    const validationSchema = Yup.object().shape({
        // matter: Yup.string().required('Matter is required'),
        // client: Yup.string().required('Client is required'),
        // amount: Yup.string().required('Amount is required'),
    })

    return (
        <>
            <Formik
                // enableReinitialize
                initialValues={
                    {
                        isYourType: "Individual",

                        //individual===========================>
                        // matter  ============>
                        matter: matterDetails?.name || "",
                        matterObj: matterDetails || {},
                        ismatterOpen: false,
                        // ============>
                        client: "",
                        clientObj: {},
                        clientItems: [],
                        isClientOpen: false,

                        //
                        prefix: "",
                        isPrefixOpen: false,
                        // matter END  ============>

                        amount: "",
                        isShowNote: false,
                        Note: "",


                        //Date of birth

                        issueDate: moment().format('DD/MM/YYYY'),
                        selectedissueDate: moment(new Date()).toISOString(),
                        isissueDateOpen: false,

                        dueDate: moment().format('DD/MM/YYYY'),
                        selecteddueDate: moment(new Date()).toISOString(),
                        isdueDateOpen: false,

                        isEmailConfirmation: true,
                        isSmsConfirmation: true,



                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    // console.log(values, "values==>");
                    const payload = {
                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        matterClientFundId: null,
                        issueDate: values?.selectedissueDate,
                        dueDate: values?.selecteddueDate,
                        receiptDate: null,
                        clientIds: String(values?.clientItems?.map((item) => item?.clientId).join(",")),
                        matterId: values?.matterObj?.matterId,
                        matterName: values?.matterObj?.name,
                        amount: Number(values.amount),
                        note: values.Note || null,
                        sendEmail: values.isEmailConfirmation,
                        sendSMS: values.isSmsConfirmation,
                        status: "PENDING",
                        code: null,
                        paidAmount: null
                    }
                    console.log(payload, "payload");
                    setFieldValue('loader', true);
                    const { res, err } = await httpRequest({
                        method: `post`,
                        path: `/ic/matter/client-fund/`,
                        params: payload,
                        navigation: navigation
                    })
                    if (res) {
                        toast.show('Transaction created successfully', { type: 'success' })
                        setFieldValue('loader', false);

                        navigation.goBack();
                    }
                    else {
                        setFieldValue('loader', false);

                        console.log(err, "GET CUSTOMER RESPONSE===>err");
                    }

                    // console.log(payload, "payload");


                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Transaction Fund" />

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


                                    <TextInputWithTitle
                                        editable={matterDetails?.matterId ? false : true}
                                        onPressButton={() => setFieldValue('ismatterOpen', true)}
                                        title="Matter"
                                        isButton={true}
                                        buttonText={values.matter ? values.matter : 'Select matter'}
                                    />
                                    {values?.isYourType !== "Individual" &&
                                        <>
                                            <TextInputWithTitle
                                                placeholder={"matter Company name"}
                                                isRequired={true}
                                                value={values.companyName}
                                                onChangeText={(txt) => setFieldValue('companyName', txt)}
                                                title="matter Company Name"

                                            />
                                            <TextInputWithTitle
                                                placeholder={"matter Company Number"}
                                                isRequired={true}
                                                value={values.companyNumber}
                                                onChangeText={(txt) => setFieldValue('companyNumber', txt)}
                                                title="matter Company Number"

                                            />
                                        </>
                                    }
                                    <TextInputWithTitle
                                        setFieldValue={setFieldValue}
                                        arrayValue={values?.clientItems}
                                        onPressButton={() => setFieldValue('isClientOpen', true)}

                                        title="Client"
                                        isButton={true}
                                        buttonText={'Select Client'}
                                        customView={({ arrayValue, setFieldValue, onPressButton, buttonText }) => (

                                            <View style={{ marginTop: 10 }}>
                                                {arrayValue.map((item, index) => (
                                                    <View
                                                        key={item.clientId}
                                                        style={styles.itemContainer}
                                                    >
                                                        <MyText>
                                                            {item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName}
                                                        </MyText>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                const updatedList = arrayValue.filter(
                                                                    (c) => c.clientId !== item.clientId
                                                                );
                                                                setFieldValue('clientItems', updatedList);
                                                            }}
                                                        >
                                                            <AntDesign name="delete" size={20} color="red" />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                                <TouchableOpacity onPress={onPressButton} style={{ paddingVertical: 10 }}>
                                                    <MyText style={styles.btnTextStyle}>{buttonText}</MyText>
                                                </TouchableOpacity>
                                            </View>

                                        )}
                                    />
                                    {/* <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isClientOpen', true)}
                                        title="Client"
                                        isButton={true}
                                        buttonText={values.client ? values.client : 'Select Prefix'}
                                    /> */}
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isdueDateOpen', true)}
                                        title="Due Date"
                                        isButton={true}
                                        buttonText={values.dueDate ? values.dueDate : 'DD/MM/YYYY'}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isissueDateOpen', true)}
                                        title="Issue Date"
                                        isButton={true}
                                        buttonText={values.issueDate ? values.issueDate : 'DD/MM/YYYY'}
                                    />
                                    <TextInputWithTitle
                                        keyboardType='numeric'
                                        placeholder={"Amount"}
                                        value={values.amount}
                                        onChangeText={(txt) => setFieldValue('amount', txt)}
                                        title="Amount"

                                    />
                                    {values?.isShowNote && <TextInputWithTitle
                                        placeholder={"Note"}
                                        value={values.Note}
                                        onChangeText={(txt) => setFieldValue('Note', txt)}
                                        title="Note"

                                    />}
                                    <AddButton onPress={() => setFieldValue('isShowNote', !values?.isShowNote)} title={values?.isShowNote ? 'Hide note' : 'Add note'} />
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                                        <MyText style={styles.title}>Email the confirmation of funds received.</MyText>
                                        <Switch
                                            value={values?.isEmailConfirmation}
                                            onValueChange={(val) => { setFieldValue("isEmailConfirmation", val) }}
                                            thumbColor={values?.isEmailConfirmation ? "#ffffff" : "#ffffff"}
                                            trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                                        <MyText style={styles.title}>SMS the confirmation of funds received.</MyText>
                                        <Switch
                                            value={values?.isSmsConfirmation}
                                            onValueChange={(val) => { setFieldValue("isSmsConfirmation", val) }}
                                            thumbColor={values?.isEmailConfirmation ? "#ffffff" : "#ffffff"}
                                            trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                                        />
                                    </View>





                                    {/* ====================================> DROP DOWN MODAL <================================================= */}
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('ismatterOpen', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('matterObj', item);

                                                    // setFieldValue('matterId', item?.matterId || '');
                                                    setMatterId(item?.matterId);
                                                    setFieldValue('matter', item?.name || '');
                                                    setFieldValue('ismatterOpen', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.name}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.ismatterOpen}
                                        data={matterData}
                                        searchKey="name"
                                    />
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isClientOpen', false)}
                                        renderItem={({ item }) => (
                                            console.log(item, "ITEMS====>"),

                                            <TouchableOpacity
                                                onPress={() => {
                                                    const alreadyExists = values.clientItems?.find(
                                                        (i) => i.clientId === item.clientId
                                                    );
                                                    if (!alreadyExists) {
                                                        setFieldValue('clientItems', [...values.clientItems, item]);
                                                    }
                                                    else {
                                                        Alert.alert('Client already added');
                                                    }
                                                    setFieldValue('client', item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName || '');
                                                    setFieldValue('clientObj', item);
                                                    setFieldValue('isClientOpen', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                    {item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isClientOpen}
                                        data={clientData}
                                        searchKey={"status"}
                                    />
                                    {/* <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isClientOpen', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('client', item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName || '');
                                                    setFieldValue('clientObj', item);
                                                    setFieldValue('isClientOpen', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isClientOpen}
                                        data={clientData}
                                        searchKey="firstName"
                                    /> */}

                                    <DatePicker
                                        modal
                                        mode='date'
                                        open={values.isissueDateOpen}
                                        date={new Date()}
                                        onConfirm={date => {
                                            setFieldValue('selectedissueDate', date?.toISOString())
                                            setFieldValue('isissueDateOpen', false);
                                            setFieldValue(
                                                'issueDate',
                                                moment(date).format('MM/DD/YYYY'),
                                            );
                                        }}
                                        onCancel={() => {
                                            setFieldValue('isissueDateOpen', false);
                                        }}
                                    />
                                    <DatePicker
                                        modal
                                        mode='date'
                                        open={values.isdueDateOpen}
                                        date={new Date()}
                                        onConfirm={date => {
                                            setFieldValue('selecteddueDate', date?.toISOString())
                                            setFieldValue('isdueDateOpen', false);
                                            setFieldValue(
                                                'dueDate',
                                                moment(date).format('MM/DD/YYYY'),
                                            );
                                        }}
                                        onCancel={() => {
                                            setFieldValue('isdueDateOpen', false);
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

export default CreateTransaction

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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 5,
        backgroundColor: '#f0f0f0',
        width: '100%',
        borderRadius: 5,
    },
    btnTextStyle: {
        fontSize: calculatefontSize(1.9),
        fontWeight: '600',
        bottom: 10,
        color: COLORS?.PRIMARY_COLOR_LIGHT
    },
})