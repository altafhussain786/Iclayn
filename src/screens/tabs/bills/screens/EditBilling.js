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
import { getTotalDuration } from '../../../../helper/Helpers'



const EditBilling = ({ navigation, route }) => {
    const billingDetails = route?.params?.billingDetails
    const dispatch = useDispatch()
    const toast = useToast();
    const [firmUserData, setFirmUserData] = useState([])
    const items = useSelector(state => state.createBillingTimeEntryItem.items);
    const expenseEntryItem = useSelector(state => state.createBillingExpenseEntryItem.items);

    const [matterData, setmatterData] = React.useState([]);
    const [eventTypeData, seteventTypeData] = React.useState([]);
    const [toClientData, setToClientData] = React.useState([]);
    const [clientId, setClientId] = React.useState("");
    const [billingData, setBillingData] = React.useState([]);
    const [toClientLoader, setToClientLoader] = React.useState(false);

    //
    const [defaultData, setDefaultData] = useState(billingDetails)
    const [matterSelected, setMatterSelected] = useState('')


    console.log(matterData, "Matter data =====================>");

    const getDefaultData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/bill/${billingDetails?.matterBillId}`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "Billing DATA =======================================>");
            setDefaultData(res?.data);
            setClientId(res?.data?.clientIds)
            if (res?.data?.matterBillingDTOList?.length > 0) {
                res?.data?.matterBillingDTOList?.forEach(item => {
                    dispatch(addTimeEntry({
                        id: Math.floor(Math.random() * 1000),
                        date: moment(item.billDate).format('YYYY-MM-DD') || '',

                        //user
                        user: 'user' || '',
                        userObj: 'item.userObj' || {},
                        description: item.description || '',
                        duration: item.duration,
                        totalDuration: getTotalDuration(item.duration) || '',
                        hourlyRate: item.hourlyRate || 0,
                        //tax
                        tax: item.taxPer,
                        taxObj: {},
                        taxAmount: item.taxAmount || 0,
                    }));
                })

            }
            if (res?.data?.matterBillExpenseDTOList?.length > 0) {
                res?.data?.matterBillExpenseDTOList?.forEach(item => {
                    dispatch(addExpenseEntry({
                        id: Math.floor(Math.random() * 1000),
                        date: moment(item.expDate).format('YYYY-MM-DD') || '',

                        //user
                        user: 'user' || '',
                        userObj: 'item.userObj' || {},
                        description: item.description || '',
                        hourlyRate: item.rate || 0,
                        //tax
                        tax: item.taxPer,
                        taxObj: {},
                        taxAmount: item.taxAmount || 0,
                    }));
                })

            }
        }
        else {
            toast.show(err, { type: 'danger' })
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }

    useEffect(() => {
        getDefaultData()
    }, [billingDetails])



    const getMatterData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/listing`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "Matter DATA =======================================>");
            setMatterSelected(res?.data?.find(item => item?.matterId === defaultData?.matterId)?.name)
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

            console.log(res, "GET TO CLEINT =======================================>");
            setToClientData(res?.data);
            setToClientLoader(false)
        }
        else {
            setToClientLoader(false)

            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }

    useEffect(() => {
        getToClientData()
    }, [clientId])



    //get users 

    useEffect(() => {

        getMatterData()

    }, [])



    const calculateAmounts = () => {
        let subtotal = 0;
        let totalTax = 0;
        let netTotal = 0;

        const allItems = [...(items || []), ...(expenseEntryItem || [])];

        allItems.forEach(item => {
            const duration = item?.totalDuration ?? 1; // If totalDuration not present (i.e., expense), assume 1

            const rate = Number(item?.hourlyRate || 0);
            const tax = Number(item?.taxAmount || 0);

            subtotal += rate * duration;
            // totalTax += (rate / 100) * tax;
            totalTax += item?.taxAmount;
        });

        netTotal = subtotal + totalTax;

        return { subtotal, totalTax, netTotal };
    };

    const { subtotal, totalTax, netTotal } = calculateAmounts();


    const maaterSeelectedData = matterData?.find(item => item?.matterId === defaultData?.matterId)?.name
    console.log(maaterSeelectedData, "maaterSeelecddddtdedData");


    const validationSchema = Yup.object().shape({
        title: Yup.string().required('title is required'),
    })
    return (
        <>

            <Formik
                enableReinitialize
                initialValues={
                    {

                        // matterselect 
                        matterSelected: matterSelected || '',
                        matterSelectedObj: matterData?.find(item => item?.matterId === defaultData?.matterId) || {},
                        isOpenMatterSelected: false,

                        //start data/time
                        isOpeninvDate: false,
                        invDate: moment(defaultData?.invoiceDate).format('YYYY-MM-DD') || '',
                        selectedinvDate: new Date(), // 👈 must be a Date object

                        //end date/time
                        isOpendueDate: false,
                        dueDate: moment(defaultData?.dueDate).format('YYYY-MM-DD') || '',
                        selecteddueDate: new Date(),


                        //description
                        description: defaultData?.matterDescription || '',


                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {

                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => {

                            navigation.goBack()
                            dispatch(resetTimeEntries(null))
                            dispatch(resetExpenseEntries(null))
                        }} isShowTitle={true} title="Edit Billing" />
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
                                    {/* <MyText>{values?.matterSelected}</MyText> */}
                                    {/* ==========================================================================================> NEW  */}
                                    <TextInputWithTitle
                                        title="Matter"
                                        isButton={true}

                                        // isRequired={true}
                                        buttonText={values.matterSelected ? values.matterSelected : 'Select Matter'}
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
                                                toClientData.map((d, i) => {
                                                    return (
                                                        <>
                                                            <View style={{ marginVertical: 10, flexDirection: "row", gap: 10 }}>
                                                                <View style={{ height: 35, width: 35, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT, justifyContent: "center", alignItems: "center", borderRadius: 30 }}>
                                                                    {d?.companyName ?
                                                                        <MyText style={{ color: COLORS?.whiteColors }}>{d?.companyName?.split('')[0]}</MyText> : <MyText style={{ color: COLORS?.whiteColors }}>{d?.firstName?.split('')[0] + '' + d?.lastName?.split('')[0]}</MyText>}
                                                                </View>

                                                                <View>
                                                                    <MyText style={{ fontWeight: 'bold' }}>{d?.companyName ? d?.companyName : d?.firstName + ' ' + d?.lastName}</MyText>
                                                                    {d?.clientAddresseDTOList[0]?.city && d?.clientAddresseDTOList[0]?.country && <MyText>{d?.clientAddresseDTOList[0]?.city + ', ' + d?.clientAddresseDTOList[0]?.country}</MyText>}
                                                                    {d?.clientEmailAddressDTOList[0]?.email && <MyText>{d?.clientEmailAddressDTOList[0]?.email}</MyText>}
                                                                    {d?.clientPhoneNumberDTOList[0]?.phoneNo && <MyText>{d?.clientPhoneNumberDTOList[0]?.phoneNo}</MyText>}
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
                                        <View style={{ width: "40%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <MyText style={{ fontWeight: "bold" }}>Subtotal :</MyText>
                                            <MyText > {subtotal?.toFixed(2)}</MyText>
                                        </View>
                                        <View style={{ width: "40%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <MyText style={{ fontWeight: "bold" }}>Tax Amount :</MyText>
                                            <MyText > {totalTax?.toFixed(2)}</MyText>
                                        </View>
                                        <View style={{ width: "40%", flexDirection: "row", justifyContent: "space-between", marginVertical: 5 }}>
                                            <MyText style={{ fontWeight: "bold" }}>Net Total :</MyText>
                                            <MyText >{netTotal?.toFixed(2)}</MyText>
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
                                            setMatterSelected(item?.name);
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
                                date={values.selectedinvDate || new Date()}
                                onConfirm={date => {
                                    setFieldValue('invDate', `${moment(date).format('MM/DD/YYYY')} : ${moment(date).format('hh:mm A')}`);
                                    setFieldValue('selectedinvDate', date); // ✅ keep as Date object
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
                                date={values.selecteddueDate || new Date()}
                                onConfirm={date => {
                                    setFieldValue('dueDate', `${moment(date).format('MM/DD/YYYY')} : ${moment(date).format('hh:mm A')}`);
                                    setFieldValue('selecteddueDate', date); // ✅ keep as Date object
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
export default EditBilling

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