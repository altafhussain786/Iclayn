import { AppState, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import DatePicker from 'react-native-date-picker';

import { useSelector } from 'react-redux'
import { useToast } from 'react-native-toast-notifications'
import * as Yup from 'yup'
import { Formik } from 'formik'
import TextInputWithTitle from '../../../../components/TextInputWithTitle'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import { COLORS } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import httpRequest from '../../../../api/apiHandler'
import ScreenHeader from '../../../../components/ScreenHeader';
import Wrapper from '../../../../components/Wrapper';
import MyText from '../../../../components/MyText';



const TIMER_KEY = 'TIMEKEEPER_STATE';

const CreateAward = ({ navigation, route }) => {
    const toast = useToast();
    const communicationDetails = route?.params?.communicationDetails;
    const [matterData, setmatterData] = React.useState([]);
    const [firmData, setfirmData] = React.useState([]);
    //TIMMER

    const [description, setDescription] = useState('No description');
    const [matter, setMatter] = useState('No matter');
    const intervalRef = useRef(null);

    //Default
    const userDetails = useSelector(state => state?.userDetails?.userDetails);

    const [defaultData, setDefaultData] = useState({});


    const getDefaultData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/time-entry/${communicationDetails?.matterTimeEntryId}`,
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
                enableReinitialize
                initialValues={
                    {

                        //matter details
                        matter: matterData?.find(user => user?.matterId === defaultData?.matterId)?.name || '',
                        matterObj: matterData?.find(user => user?.matterId === defaultData?.matterId) || {},
                        isOpenmatter: false,

                        description: defaultData?.description || '',



                        //Date
                        date: moment(defaultData?.entryDate).format('DD/MM/YYYY'),
                        selectedDate: defaultData?.entryDate || moment().toISOString(),
                        isdateOpen: false,

                        //Firm Data
                        firmData: firmData?.find(user => user?.userId === defaultData?.firmUserId)?.userProfileDTO?.fullName || "",
                        firmObj: firmData?.find(user => user?.userId === defaultData?.firmUserId) || {},
                        isOpenfirm: false,
                        // firmItems: [],

                        //rate
                        rate: defaultData?.rate || '',
                        amount: defaultData?.amount || '',

                        nonBillable: defaultData?.nonBillable || false,
                        isShowEntryontheBill: defaultData?.visibleBill || false,
                        //loader
                        loader: false,
                        description: defaultData?.description || ''
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {

                    const payload =
                    {
                        createdOn: defaultData?.createdOn,
                        updatedOn: defaultData?.updatedOn,
                        createdBy: userDetails?.userId,
                        updatedBy: userDetails?.userId,
                        revision: null,
                        matterTimeEntryId: communicationDetails?.matterTimeEntryId,
                        matterId: values?.matterObj?.matterId,
                        taskId: null,
                        eventScheduleId: null,
                        attachmentId: null,
                        odDocId: null,
                        matterName: values?.matterObj?.name || null,
                        entryDate: values?.selectedDate,
                        firmUserId: values?.firmObj?.userId,
                        rate: Number(values?.rate),
                        nonBillable: values?.nonBillable,
                        visibleBill: values?.isShowEntryontheBill,

                        description: values?.description,
                        billed: false,
                        amount: defaultData?.amount || Number(totalHOurs),
                        module: "DASHBOARD",
                        noteId: null,
                        commLogId: null

                    }
                    setFieldValue('loader', true)
                    const { res, err } = await httpRequest(
                        {
                            method: `put`,
                            path: `/ic/matter/time-entry/`,
                            params: payload,
                            navigation: navigation
                        })
                    if (res) {
                        toast.show('Time Entry updated successfully', { type: 'success' })
                        setFieldValue('loader', false)

                        navigation.goBack();
                    }
                    else {
                        setFieldValue('loader', false)

                        console.log("err", err);
                    }

                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Award" />
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

                                <TextInputWithTitle
                                    placeholder={'Amount'}
                                    title="Amount"
                                    isRequired={true}
                                    onChangeText={(txt) => setFieldValue('amount', txt)}
                                    value={values.amount?.toString()}
                                />
                                {
                                    errors.amount && touched.amount && <MyText style={{ color: 'red' }}>{errors.amount}</MyText>
                                }

                                <TextInputWithTitle
                                    placeholder={'Rate'}
                                    title="Rate"
                                    isRequired={true}
                                    onChangeText={(txt) => setFieldValue('rate', txt)}
                                    value={values.rate?.toString()}
                                />
                                {
                                    errors.rate && touched.rate && <MyText style={{ color: 'red' }}>{errors.rate}</MyText>
                                }
                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isdateOpen', true)}
                                    title="Open Date"
                                    isButton={true}
                                    buttonText={values.date ? values.date : 'Select Open date'}
                                />


                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpenfirm', true)}
                                    title="Fee recipient "
                                    isRequired={true}
                                    isButton={true}
                                    buttonText={values.firmData ? values.firmData : 'Select '}
                                />
                                {
                                    errors.firmData && touched.firmData && <MyText style={{ color: 'red' }}>{errors.firmData}</MyText>
                                }

                                <TextInputWithTitle
                                    placeholder={'Description'}
                                    title="Descrition"
                                    // extraStyle={{ textAlign: 'top' }}
                                    extraInputStyle={{ height: 100, textAlignVertical: 'top' }}
                                    isRequired={true}
                                    onChangeText={(txt) => setFieldValue('description', txt)}
                                    value={values.description?.toString()}
                                />
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

export default CreateAward

const styles = StyleSheet.create({
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
    itemStyle: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderColor: COLORS?.BORDER_LIGHT_COLOR
    },
})