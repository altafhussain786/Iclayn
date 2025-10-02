import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker';
import { useToast } from 'react-native-toast-notifications'
//icons 
import AntDesign from 'react-native-vector-icons/AntDesign';
import ScreenHeader from '../../../../components/ScreenHeader'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import TextInputWithTitle from '../../../../components/TextInputWithTitle'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import { COLORS } from '../../../../constants'
import AddButton from '../../../../components/AddButton'
import httpRequest from '../../../../api/apiHandler'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import ReminderItems from '../../tasks/components/ReminderItems'
import { addReminderItem } from '../../../../store/slices/taskSlice/createItemforReminder'
import Loader from '../../../../components/Loader'
import LoaderKitView from 'react-native-loader-kit'
import { addTimeEntry, resetTimeEntries } from '../../../../store/slices/billingSlice/createBillingTimeEntryItem'
import BillingTimeEntry from '../components/BillingTimeEntry'
import BillingExpenseEntry from '../components/BillingExpenseEntry'
import { addExpenseEntry, resetExpenseEntries } from '../../../../store/slices/billingSlice/createBillingExpenseEntryItem'
import { formatNumber, getTotalDuration } from '../../../../helper/Helpers'
import { addFixedFee, resetFixedFees } from '../../../../store/slices/billingSlice/createFixedFeeDetailItem'
import FixedFeeDetails from '../components/FixedFeeDetails'
import { addContingencyFee, resetContingencyFees } from '../../../../store/slices/billingSlice/createContingencyFeeEntryItem'
import ContigencyFeeDetails from '../components/ContigencyFeeDetails'



const CreateBilling = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails
    const dispatch = useDispatch()

    const toast = useToast();
    const [firmUserData, setFirmUserData] = useState([])
    const items = useSelector(state => state.createBillingTimeEntryItem.items);
    const fixedFeeItem = useSelector(state => state.createFixedFeeDetailItem.items);
    const contingencyFeeItem = useSelector(state => state.createContingencyFeeEntryItem.items);
    const expenseEntryItem = useSelector(state => state.createBillingExpenseEntryItem.items);
    const userDetails = useSelector(state => state?.userDetails?.userDetails);



    const [matterData, setmatterData] = React.useState([]);
    const [eventTypeData, seteventTypeData] = React.useState([]);
    const [toClientData, setToClientData] = React.useState([]);
    const [clientId, setClientId] = React.useState("");
    const [billingData, setBillingData] = React.useState([]);
    const [toClientLoader, setToClientLoader] = React.useState(false);
    const [selectedMatter, setSelectedMatter] = useState(null);

    ///////new states
    const [userData, setUserData] = useState([]);


    const getUserData = async () => {
        const { res, err } = await httpRequest({
            method: 'get',
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setUserData(res?.data);
        }
        else {
            console.log(err, "GET USER DATA RES=====================>", res);
            console.log("errd", err);
        }
    }


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
    const getToClientData = async () => {
        setToClientLoader(true)
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/${clientId}/client`,
            navigation: navigation
        })
        if (res) {
            console.log(res);

            setToClientData(res?.data);
            setToClientLoader(false)
        }
        else {
            setToClientLoader(false)

            console.log(err, "GET CUSTOMER RESPONSE===>err CLIENT");

        }
    }

    useEffect(() => {
        if (matterDetails) {
            setClientId(matterDetails?.matterId)
        }
    }, [matterDetails])


    useEffect(() => {
        if (clientId !== "") {

            getToClientData()
        }
    }, [clientId])



    //get users 

    useEffect(() => {
        getUserData()
        getMatterData()
    }, [])

    const getHourlyData = async () => {

        const { res, err, status } = await httpRequest({
            method: `get`,
            path: `/ic/matter/time-entry/mat/${selectedMatter?.matterId}`,
            navigation: navigation
        })
        if (status == 204) {
            console.log(res, "getHourlData dentries 204");
            dispatch(resetTimeEntries());
            return
        }
        else {
            if (res) {

                const data = res?.data
                console.log(data, "HOURLY DATA=========>");


                data?.forEach(item => {

                    if (!item?.billed) {
                        dispatch(addTimeEntry({
                            id: Math.floor(Math.random() * 1000),
                            dataObj: item,
                            selectedDate: item.createdOn || '',
                            date: moment(item.createdOn).format('YYYY-MM-DD') || '',
                            user: userData?.find(user => user?.userId == item?.firmUserId)?.userProfileDTO?.fullName || '',
                            userObj: userData?.find(user => user?.userId == item?.firmUserId) || {},
                            description: item.description || '',
                            duration: item.duration,
                            totalDuration: getTotalDuration(item.duration) || '',
                            hourlyRate: item.rate || 0,
                            //tax
                            tax: item.taxRate || 20,
                            taxObj: {},
                            taxAmount: item.taxRate || 20,
                        }));
                    }
                })

            }
            else {
                console.log(err, "getHourlyData===>err CLIENT");

            }
        }
    }

    const getContigencyData = async () => {

        dispatch(resetContingencyFees());
        const { res, err, status } = await httpRequest({
            method: `get`,
            path: `/ic/matter/award/mat/${selectedMatter?.matterId}`,
            navigation: navigation
        })
        if (status == 204) {
            console.log(res, "getContigencyData entries 204");
            return
        }
        else {
            if (res) {
                const data = res?.data
                console.log(data, "CONTIGENCYf DATA=========");


                data?.forEach(item => {
                    console.log(item, "item for contigency ================================");

                    if (!item?.billed) {

                        dispatch(addContingencyFee({
                            id: Math.floor(Math.random() * 100000),
                            date: moment(item?.awardDate).format('YYYY-MM-DD') || '',
                            user: userData?.find(user => user?.userId == item?.feeRecipientId)?.userProfileDTO?.fullName || '',
                            userObj: userData?.find(user => user?.userId == item?.feeRecipientId) || {},
                            description: item?.description || '',

                            // important fields
                            awardedAmount: item?.amount,              // Awarded Amount
                            contingencyRate: item?.rate,          // Contingency %
                            // Contingency * AwardedAmount / 100

                            // tax fields
                            tax: 20,
                            taxObj: {},

                            dataObj: item,
                            selectedDate: moment(item?.awardDate).format('YYYY-MM-DD') || '',
                            // future expansion


                            // final total

                        }));
                    }

                })
            }
            else {
                console.log(err, "getContigencyData===>err CLIENT");

            }
        }
    }
    const getFixedData = async () => {
        dispatch(resetFixedFees());
        const { res, err, status } = await httpRequest({
            method: `get`,
            path: `/ic/matter/bill/mat/${selectedMatter?.matterId}/billing-item`,
            navigation: navigation
        })
        if (status == 204) {
            console.log(res, "getFixedData entries 204");
            return
        }
        else {
            if (res) {
                const data = res?.data
                console.log(data, "FIXED DATA=========");


                data?.forEach(item => {

                    if (!item?.billed) {
                        dispatch(addFixedFee({
                            id: Math.floor(Math.random() * 1000),
                            date: moment(item.createdOn).format('YYYY-MM-DD') || '',
                            user: userData?.find(user => user?.userId == item?.userId)?.userProfileDTO?.fullName || '',
                            userObj: userData?.find(user => user?.userId == item?.userId) || {},
                            description: '',
                            selectedDate: item?.createdOn || '',
                            hourlyRate: item.rate || 0,
                            //tax
                            tax: 20,
                            taxObj: {},
                            taxAmount: 20 || 0,
                        }));
                    }
                })
            }
            else {
                console.log(err, "getFixedData===>err CLIENT");

            }
        }
    }

    const getExpenseEntrties = async () => {
        dispatch(resetExpenseEntries());
        const { res, err, status } = await httpRequest({
            method: `get`,
            path: `/ic/matter/exp-entry/mat/${selectedMatter?.matterId}`,
            navigation: navigation
        })
        if (status == 204) {
            console.log(res, "getExpense entries entries 204");
            dispatch(resetExpenseEntries());
            return
        }
        else {
            if (res) {
                const data = res?.data
                console.log(data, "Expense Data-------------------------------------------------------------->");

                data?.forEach(item => {

                    if (!item?.billed) {
                        dispatch(addExpenseEntry({
                            id: Math.floor(Math.random() * 1000),
                            date: moment(item.expDate).format('YYYY-MM-DD') || '',
                            dataObj: item || {},
                            //user
                            user: userData?.find(user => user?.userId == item?.firmUserId)?.userProfileDTO?.fullName || '',
                            userObj: userData?.find(user => user?.userId == item?.firmUserId) || {},
                            description: item.description || '',
                            hourlyRate: String(item.amount) || 0,
                            //tax
                            tax: item.taxRate || 20,
                            taxObj: {},
                            taxAmount: item.taxRate || 20,
                        }));
                    }
                })

            }
            else {
                console.log(err, "getExpenseEntrties===>err CLIENT");

            }
        }
    }


    // console.log(selectedMatter, "=====================MATTER DATA");
    useEffect(() => {
        if (!selectedMatter) return; // agar selectedMatter hi nahi hai to kuch mat karo
        // ye function hamesha chalega
        getExpenseEntrties();

        const method = selectedMatter?.matterBillingDTOList?.[0]?.method;
        console.log(method, "method");


        switch (method) {
            case "HOURLY":
                getHourlyData();
                break;
            case "CONTINGENCYFEEDEFAULTS":
                getContigencyData();
                break;
            case "FIXEDFEEDETAILS":
                getFixedData();
                break;
            default:
                break;
        }
    }, [selectedMatter]);

    const method = selectedMatter?.matterBillingDTOList?.[0]?.method;


    const calculateAmounts = () => {
        let subtotal = 0;
        let totalTax = 0;
        let netTotal = 0;

        // const allItems = [
        //     ...(items || []),            // time entries
        //     ...(expenseEntryItem || []), // expenses
        //     ...(fixedFeeItem || []),     // fixed fee
        //     ...(contingencyFeeItem || []) // contingency fee ✅
        // ];

        let allItems = [];

        // ✅ Method based items
        switch (method) {
            case "HOURLY":
                allItems = [...(items || []), ...(expenseEntryItem || [])];
                break;
            case "FIXEDFEEDETAILS":
                allItems = [...(fixedFeeItem || []), ...(expenseEntryItem || [])];
                break;
            case "CONTINGENCYFEEDEFAULTS":
                allItems = [...(contingencyFeeItem || []), ...(expenseEntryItem || [])];
                break;
            default:
                allItems = [];
                break;
        }

        allItems?.forEach(item => {
            if (item?.awardedAmount !== undefined && item?.contingencyRate !== undefined) {
                // ✅ Contingency fee calculation (based on awardedAmount & contingencyRate)
                //==========================================================>
                const awardedAmount = Number(item?.awardedAmount || 0);
                const contingencyRate = Number(item?.contingencyRate || 0);
                const amount = (awardedAmount * contingencyRate) / 100;

                const taxPercentage = 20;
                const lineTax = (amount * taxPercentage) / 100;


                subtotal += amount;
                totalTax += lineTax;

            } else {
                // ✅ Time entry + Fixed fee + Expense case
                const rate = Number(item?.hourlyRate || 0);
                const taxPercentage = Number(item?.taxAmount || 0);

                const duration = item?.totalDuration !== undefined
                    ? Number(item?.totalDuration)
                    : null;

                const lineTotal = duration !== null ? rate * duration : rate;
                const lineTax = (lineTotal * taxPercentage) / 100;

                subtotal += lineTotal;
                totalTax += lineTax;
            }
        });

        netTotal = subtotal + totalTax;

        return { subtotal, totalTax, netTotal };
    };

    useEffect(() => {
        calculateAmounts();
    }, [items, expenseEntryItem, fixedFeeItem, contingencyFeeItem]);


    const { subtotal, totalTax, netTotal } = calculateAmounts();



    const validationSchema = Yup.object().shape({
        matterSelected: Yup.string().required('Matter is required'),

    })


    return (
        <>

            <Formik
                // enableReinitialize
                initialValues={
                    {

                        // matterselect 
                        matterSelected: matterDetails?.name || '',
                        matterSelectedObj: matterDetails || {},
                        isOpenMatterSelected: false,

                        //start data/time
                        isOpeninvDate: false,
                        invDate: '',
                        selectedinvDate: moment(new Date()).toISOString(), // 👈 must be a Date object

                        //end date/time
                        isOpendueDate: false,
                        dueDate: '',
                        selecteddueDate: moment(new Date()).toISOString(),


                        //description
                        description: '',


                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {



                    const mappedForContigency = contingencyFeeItem?.map((d, i) => {
                        const awardedAmount = Number(d?.awardedAmount || 0);
                        const contingencyRate = Number(d?.contingencyRate || 0); // percentage
                        const amount = (awardedAmount * contingencyRate) / 100;

                        const taxPercentage = 20;
                        const taxTotal = ((amount * taxPercentage) / 100);
                        const total = (amount + (amount * taxPercentage) / 100);
                        return {

                            createdOn: d?.dataObj?.createdOn,
                            matterBillAwardId: null,
                            matterAwardId: d?.dataObj?.matterAwardId,
                            billDate: new Date(d?.date).toISOString() || '',
                            feeRecipientId: d?.dataObj?.feeRecipientId,
                            description: d?.description || '',
                            amount: awardedAmount,
                            rate: Number(d?.contingencyRate),
                            taxId: d?.dataObj?.taxId || 1,
                            taxPer: taxPercentage,
                            taxAmount: taxTotal,
                            totalAmount: total
                        }
                    })



                    const mappedFixFeeDetails = fixedFeeItem?.map((d, i) => {
                        const rate = Number(d?.hourlyRate || 0);
                        const taxPercentage = Number(d?.taxAmount || 0);

                        // agar totalDuration available hai to timeEntry hai, warna fixed fee
                        const duration = d?.totalDuration !== undefined ? Number(d?.totalDuration) : null;

                        const lineTotal = duration !== null ? rate * duration : rate;
                        const lineTax = (lineTotal * taxPercentage) / 100;
                        const grandTotal = lineTotal + lineTax;

                        return {
                            amount: 0,
                            billDate: new Date(d?.selectedDate).toISOString().replace('Z', '+05:00') || '',
                            description: "",
                            matterBillServiceItemId: null,
                            matterServiceItemId: d?.serviceItemObj?.serviceItemId || null,
                            rate: rate,
                            taxAmount: lineTax,
                            taxId: d?.dataObj?.taxId || 1,
                            taxPer: taxPercentage || 20,
                            totalAmount: lineTotal,
                            userId: d?.userObj?.userId,
                        }
                    })


                    const mappedData = expenseEntryItem?.map((d, i) => {
                        return {
                            createdOn: d?.dataObj?.createdOn || '',
                            updatedOn: d?.dataObj?.createdOn || null,
                            createdBy: userDetails?.userId || null,
                            updatedBy: null,
                            revision: null,
                            matterBillExpenseId: null,
                            expEntryId: d?.dataObj?.matterExpenseEntryId || null,
                            expDate: moment(d?.date, 'MM/DD/YYYY').toISOString() || '',
                            userId: d?.userObj?.userId || 0,
                            description: d?.description || '',
                            rate: d?.hourlyRate || "0",
                            taxRate: 0,
                            quantity: 1,
                            taxId: d?.taxObj?.taxId || 1,
                            taxPer: Number(d?.taxAmount),
                            taxAmount: (Number(d?.hourlyRate) / 100) * Number(d?.taxAmount) || 0,
                            totalAmount: Number(d?.hourlyRate) || 0,
                            nonBillable: false,
                            visibleBill: false
                        }
                    })

                    // HOURLY PAY KAM KRNA PARY GA ================ >
                    const mappedMatterBillingDTOList = items?.map((d, i) => {
                        return {
                            createdOn: d?.dataObj?.createdOn || null,
                            updatedOn: d?.dataObj?.updatedOn || null,
                            createdBy: userDetails?.userId || 0,
                            updatedBy: null,
                            revision: null,
                            matterBillTimeId: null,
                            matterTimeEntryId: d?.dataObj?.matterTimeEntryId || null,
                            billDate: d?.selectedDate ? new Date(d?.selectedDate).toISOString().replace('Z', '+05:00') : null,
                            userId: d?.userObj?.userId || 0,
                            description: d?.description || '',
                            duration: d?.duration,
                            hourlyRate: d?.hourlyRate,
                            rate: d?.hourlyRate || 0,
                            taxId: d?.taxObj?.taxId || 1,
                            taxPer: Number(d?.taxAmount),
                            taxAmount: Number(((d?.hourlyRate * d?.totalDuration) * d?.taxAmount) / 100) || 0,
                            totalAmount: (d?.hourlyRate * d?.totalDuration) || 0,
                            nonBillable: false,
                            visibleBill: false
                        }
                    })


                    const payload = {

                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails?.userId || 0,
                        updatedBy: null,
                        revision: null,
                        matterBillId: null,
                        dueDate: new Date(values.selecteddueDate).toISOString() || '' || "",
                        invoiceDate: new Date(values.selecteddueDate).toISOString() || '' || "",
                        matterId: values?.matterSelectedObj?.matterId || 0,
                        matterDescription: values.matterSelectedObj?.description || '',
                        subTotal: subtotal || 0,
                        taxTotal: totalTax || 0,
                        netTotal: netTotal || 0,
                        paidTotal: 0,
                        status: "UNPAID",

                        matterBillingDTOList: mappedMatterBillingDTOList || [],
                        matterBillAwardDTOList: mappedForContigency || [],
                        matterBillServiceItemDTOList: mappedFixFeeDetails || [],
                        matterBillExpenseDTOList: mappedData || [],

                        clientIds: toClientData?.map(item => item?.clientId).join(",") || "",
                        type: method || "HOURLY"
                    }

                    console.log(payload, '=======================ddd=====>Payload');



                    const { res, err } = await httpRequest({
                        method: "post",
                        path: "/ic/matter/bill/",
                        params: payload,
                        header: { "Content-Type": "application/json" },
                        navigation
                    });
                    if (res) {
                        toast.show('Billing created successfully', { type: 'success' })
                        navigation.goBack()
                    }
                    else {
                        console.log("err", err);
                    }



                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Billing" />
                        <Wrapper>
                            <KeyboardAvoidingView
                                style={{ flex: 1 }}
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0} // adjust as needed
                            >

                                <ScrollView
                                    contentContainerStyle={{ paddingBottom: 50 }}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >

                                    {/* ==========================================================================================> NEW  */}
                                    <TextInputWithTitle
                                        editable={matterDetails?.matterId ? false : true}

                                        title="Matter"
                                        isButton={true}
                                        // isRequired={true}
                                        buttonText={values.matterSelected || 'Select Matter'}
                                        onPressButton={() => setFieldValue('isOpenMatterSelected', true)}
                                    />
                                    {
                                        errors.matterSelected && touched.matterSelected && (
                                            <MyText style={{ color: 'red' }}>{errors.matterSelected}</MyText>
                                        )
                                    }
                                    <View style={{ marginVertical: 10 }}>
                                        <MyText style={styles.btnTextStyle}>To</MyText>
                                        {
                                            toClientLoader ? <LoaderKitView
                                                style={{ width: 30, height: 30 }}
                                                name={'BallPulse'}
                                                animationSpeedMultiplier={1.0} // speed up/slow down animation, default: 1.0, larger is faster
                                                color={COLORS?.LIGHT_COLOR} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
                                            /> :
                                                toClientData?.map((d, i) => {
                                                    return (
                                                        <>
                                                            <View style={{ marginVertical: 10, flexDirection: "row", gap: 10 }}>
                                                                <View style={{ height: 35, width: 35, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT, justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                                                                    {d?.companyName ?
                                                                        <MyText style={{ color: COLORS?.whiteColors }}>{d?.companyName?.split('')[0]}</MyText> : <MyText style={{ color: COLORS?.whiteColors }}>{d?.firstName?.split('')[0] + '' + d?.lastName?.split('')[0]}</MyText>}
                                                                </View>

                                                                <View>
                                                                    <MyText style={{ fontWeight: 'bold' }}>{d?.companyName ? d?.companyName : d?.firstName + ' ' + d?.lastName}</MyText>
                                                                    {
                                                                        d?.clientAddresseDTOList?.length > 0 &&
                                                                        d?.clientAddresseDTOList[0]?.city && d?.clientAddresseDTOList[0]?.country && <MyText>{d?.clientAddresseDTOList[0]?.city + ', ' + d?.clientAddresseDTOList[0]?.country}</MyText>}
                                                                    {
                                                                        d?.clientEmailAddressDTOList?.length > 0 &&
                                                                        d?.clientEmailAddressDTOList[0]?.email && <MyText>{d?.clientEmailAddressDTOList[0]?.email}</MyText>}
                                                                    {
                                                                        d?.clientPhoneNumberDTOList?.length > 0 &&

                                                                        d?.clientPhoneNumberDTOList[0]?.phoneNo && <MyText>{d?.clientPhoneNumberDTOList[0]?.phoneNo}</MyText>}
                                                                </View>
                                                            </View>
                                                        </>
                                                    )
                                                })
                                        }
                                    </View>
                                    <TextInputWithTitle title='Description' value={values.description} onChangeText={(txt) => setFieldValue('description', txt)} placeholder={'Description'} />

                                    <TextInputWithTitle
                                        title="Invoice Date "
                                        isButton={true}
                                        // isRequired={true}
                                        buttonText={values.invDate || 'Select Invoice Date'}
                                        onPressButton={() => setFieldValue('isOpeninvDate', true)}
                                    />
                                    <TextInputWithTitle
                                        title="Due Date "
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.dueDate || 'Select Due Date'}
                                        onPressButton={() => setFieldValue('isOpendueDate', true)}
                                    />

                                    {/* //item =====================================> */}
                                    {
                                        selectedMatter?.matterBillingDTOList?.length > 0 &&
                                        (
                                            method == "HOURLY" ?
                                                <View style={{ marginVertical: 10 }}>
                                                    <MyText style={[styles.btnTextStyle, { fontSize: calculatefontSize(2) }]}>Time Entries</MyText>
                                                    <MyText style={{ fontSize: calculatefontSize(1.4) }}>Any modifications made to the current time entries will be updated in the matter.
                                                    </MyText>
                                                    <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>

                                                        {
                                                            items?.map((item, index) => {
                                                                return (
                                                                    <>

                                                                        <BillingTimeEntry item={item} index={index} navigation={navigation} />

                                                                    </>
                                                                )
                                                            })

                                                        }
                                                        <AddButton onPress={() => dispatch(addTimeEntry({
                                                            id: Math.floor(Math.random() * 1000),
                                                        }))} title='Add a time entry' />
                                                    </View>
                                                </View>
                                                :
                                                method == "CONTINGENCYFEEDEFAULTS" ?
                                                    <View style={{ marginVertical: 10 }}>
                                                        <MyText style={[styles.btnTextStyle, { fontSize: calculatefontSize(2) }]}>Contingency Fee
                                                        </MyText>
                                                        <MyText style={{ fontSize: calculatefontSize(1.4) }}>Any modifications made to the current fee entries will be updated in the matter.
                                                        </MyText>
                                                        <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>

                                                            {
                                                                contingencyFeeItem?.map((item, index) => {
                                                                    return (
                                                                        <>

                                                                            <ContigencyFeeDetails item={item} index={index} navigation={navigation} />

                                                                        </>
                                                                    )
                                                                })

                                                            }
                                                            <AddButton onPress={() => dispatch(addContingencyFee({
                                                                id: Math.floor(Math.random() * 1000),
                                                            }))} title='Add a Contingency fee entry' />
                                                        </View>
                                                    </View>
                                                    :
                                                    <View style={{ marginVertical: 10 }}>
                                                        <MyText style={[styles.btnTextStyle, { fontSize: calculatefontSize(2) }]}>Fixed Fee Detail</MyText>
                                                        <MyText style={{ fontSize: calculatefontSize(1.4) }}>Any modifications made to the current time entries will be updated in the matter.
                                                        </MyText>

                                                        <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>

                                                            {
                                                                fixedFeeItem?.map((item, index) => {
                                                                    return (
                                                                        <>

                                                                            <FixedFeeDetails item={item} index={index} navigation={navigation} />

                                                                        </>
                                                                    )
                                                                })

                                                            }
                                                            <AddButton onPress={() => dispatch(addFixedFee({
                                                                id: Math.floor(Math.random() * 1000),
                                                            }))} title='Add a fixed fee entry' />
                                                        </View>
                                                    </View>)

                                    }
                                    {/* //item =====================================> */}
                                    <View style={{ marginVertical: 10 }}>
                                        <MyText style={[styles.btnTextStyle, { fontSize: calculatefontSize(2) }]}>Expense Entries</MyText>
                                        <MyText style={{ fontSize: calculatefontSize(1.4) }}>Update to the existing expense entries will be applied to the matter.

                                        </MyText>
                                        <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>

                                            {
                                                expenseEntryItem?.map((item, index) => {
                                                    return (
                                                        <>

                                                            <BillingExpenseEntry item={item} index={index} navigation={navigation} />

                                                        </>
                                                    )
                                                })

                                            }
                                            <AddButton onPress={() => dispatch(addExpenseEntry({
                                                id: Math.floor(Math.random() * 1000),
                                            }))} title='Add a time entry' />
                                        </View>
                                    </View>
                                    <View style={{ alignItems: "flex-end", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, padding: 10 }}>
                                        <View style={{ width: "70%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <MyText style={{ fontWeight: "bold" }}>Subtotal :</MyText>
                                            <MyText >£ {formatNumber(subtotal)}</MyText>
                                        </View>
                                        <View style={{ width: "70%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <MyText style={{ fontWeight: "bold" }}>Tax Amount :</MyText>
                                            <MyText >£ {formatNumber(totalTax)}</MyText>
                                        </View>
                                        <View style={{ width: "70%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <MyText style={{ fontWeight: "bold" }}>Net Total :</MyText>
                                            <MyText >£ {formatNumber(netTotal)}</MyText>
                                        </View>

                                    </View>
                                    <View style={{ height: 20 }} />
                                </ScrollView>

                            </KeyboardAvoidingView>
                            {/* MODAL ======================================================================> */}
                            <BottomModalListWithSearch
                                onClose={() => setFieldValue('isOpenMatterSelected', false)}
                                renderItem={({ item }) => (


                                    <TouchableOpacity
                                        onPress={() => {
                                            setClientId(item?.matterId);
                                            setSelectedMatter(item);
                                            setFieldValue('description', item?.description);
                                            setFieldValue('matterSelected', item?.name);
                                            setFieldValue('matterSelectedObj', item);
                                            setFieldValue('isOpenMatterSelected', false)
                                        }}
                                        style={styles.itemStyle}
                                    >
                                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                            {item?.name}
                                        </MyText>
                                    </TouchableOpacity>
                                )}
                                visible={values?.isOpenMatterSelected}
                                data={matterData}
                                searchKey="name"
                            />



                            {/* //PICKER ============================> */}

                            {/* //select start date and time  */}
                            <DatePicker
                                modal
                                mode='datetime'
                                open={values.isOpeninvDate}
                                date={new Date()}
                                onConfirm={date => {
                                    setFieldValue('invDate', `${moment(date).format('MM/DD/YYYY')} : ${moment(date).format('hh:mm A')}`);
                                    setFieldValue('selectedinvDate', date?.toISOString()); // ✅ keep as Date object
                                    setFieldValue('isOpeninvDate', false);
                                }}
                                onCancel={() => {
                                    setFieldValue('isOpeninvDate', false);
                                }}
                            />

                            <DatePicker
                                modal
                                mode='datetime'
                                open={values.isOpendueDate}
                                date={new Date()}
                                onConfirm={date => {
                                    setFieldValue('dueDate', `${moment(date).format('MM/DD/YYYY')} : ${moment(date).format('hh:mm A')}`);
                                    setFieldValue('selecteddueDate', date?.toISOString()); // ✅ keep as Date object
                                    setFieldValue('isOpendueDate', false);
                                }}
                                onCancel={() => {
                                    setFieldValue('isOpendueDate', false);
                                }}
                            />
                        </Wrapper>
                    </>

                )}
            </Formik>

        </>
    )
}


export default CreateBilling

const styles = StyleSheet.create({
    title: {
        fontSize: calculatefontSize(2),
        // fontFamily:fontFamily.Bold,
        // fontWeight: "bold",
        color: COLORS.GREY_COLOR,
    },
    label: {
        color: '#627585',
        // marginBottom: 5,
        fontWeight: '600',
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