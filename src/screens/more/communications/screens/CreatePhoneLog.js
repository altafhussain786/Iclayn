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





const CreatePhoneLog = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails

    const dispatch = useDispatch();
    const items = useSelector(state => state.createItemForAddEmail.items);
    const userDetails = useSelector(state => state?.userDetails?.userDetails);


    const [matterData, setmatterData] = useState([]);
    const [fromData, setfromData] = useState([]);
    const [toData, settoData] = useState([]);

    const getmatterData = async () => {
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
    const getFromData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setfromData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    const getToData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/client/`,
            navigation: navigation
        })
        if (res) {
            settoData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    useEffect(() => {
        getToData();
        getFromData();
        getmatterData();
    }, [])

    const validationSchema = Yup.object().shape({
    })

    const formatDurationInput = (text) => {
        const digits = text.replace(/\D/g, ''); // remove all non-digit characters
        const hh = digits.slice(0, 2);
        const mm = digits.slice(2, 4);
        const ss = digits.slice(4, 6);

        let formatted = hh;
        if (digits.length > 2) formatted += ':' + mm;
        if (digits.length > 4) formatted += ':' + ss;

        return formatted;
    };


    return (
        <>
            <Formik
                // enableReinitialize
                initialValues={
                    {
                        isYourType: "Individual",

                        //individual===========================>
                        // matter  ============>
                        matter: matterDetails?.name || '',
                        matterObj: matterDetails || {},
                        isOpenMatter: false,
                        // ============>

                        from: "",
                        fromObj: {},
                        isOpenFrom: false,

                        //to
                        to: "",
                        toObj: {},
                        isOpenTo: false,
                        prefix: "",
                        isPrefixOpen: false,
                        // matter END  ============>

                        subject: "",
                        body: "",


                        //Date of birth

                        date: moment().format('DD/MM/YYYY'),
                        selecteddate: moment(new Date()).toISOString(),
                        isdateOpen: false,

                        // time 
                        time: moment().format('hh:mm A'),
                        selectedtime: moment(new Date()).toISOString(),
                        isTimeOpen: false,
                        //duration
                        recordedTime: '',


                        // ========================>COMPANY ===>
                        companyName: "",
                        companyNumber: "",

                        //
                        documentFile: '',

                        //loader
                        loader: false
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(values, "values=======================>");
                    const payload =
                    {
                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        matterComLogId: null,
                        logDate: values?.selecteddate,
                        logTime: values?.selectedtime,
                        fromId: values?.fromObj?.userId,
                        toId: values?.toObj?.clientId,
                        subject: values?.subject,
                        body: values?.body,
                        timer: null,
                        matterId: values?.matterObj?.matterId,
                        type: "Phone",
                        attachmentDTOList: null,
                        status: "Active"
                    }

                    const { res, err } = await httpRequest({
                        method: `post`,
                        path: `/ic/matter/comm-log/`,
                        params: payload,
                        navigation: navigation
                    })
                    if (res) {
                        console.log(res, "res data");
                        navigation.goBack();
                    }
                    else {
                        console.log("err", err);
                    }

                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Phone logs" />

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

                                        onPressButton={() => setFieldValue('isOpenMatter', true)}
                                        title="Matter "
                                        isRequired={true}
                                        isButton={true}
                                        buttonText={values.matter ? values.matter : 'Select Matter'}
                                    />

                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isdateOpen', true)}
                                        title="Date"
                                        isButton={true}
                                        buttonText={values.date ? values.date : 'DD/MM/YYYY'}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isTimeOpen', true)}
                                        title="Time"
                                        isButton={true}
                                        buttonText={values.time ? values.time : 'hh:mm A'}
                                    />

                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenFrom', true)}
                                        title="From"
                                        isButton={true}
                                        buttonText={values.from ? values.from : 'Select....'}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenTo', true)}
                                        title="To"
                                        isButton={true}
                                        buttonText={values.to ? values.to : 'Select....'}
                                    />
                                    <TextInputWithTitle
                                        placeholder={"Subject"}
                                        value={values.subject}
                                        onChangeText={(txt) => setFieldValue('subject', txt)}
                                        title="Subject"

                                    />
                                    <TextInputWithTitle
                                        placeholder={"body"}
                                        value={values.body}
                                        onChangeText={(txt) => setFieldValue('body', txt)}
                                        title="Body"

                                    />
                                    {/* <TextInputWithTitle
                                        placeholder={"00h 00m 00s"}
                                        value={values.recordedTime}
                                        onChangeText={(txt) => setFieldValue('recordedTime', txt)}
                                        title="Recorded time"

                                    /> */}
                                    <MyText style={styles.label}>Recorded Time</MyText>
                                    <TextInput
                                        keyboardType='numeric'
                                        placeholder="Duration (hh:mm:ss)"
                                        value={String(values.duration || '')}
                                        onChangeText={(txt) => {
                                            const formatted = formatDurationInput(txt);
                                            setFieldValue('duration', formatted);
                                            // dispatch(updateTimeEntryField({ id, field: 'duration', value: formatted }));
                                        }}
                                        onEndEditing={(e) => {
                                            const txt = e.nativeEvent.text;
                                            const durationRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

                                            if (!durationRegex.test(txt)) {
                                                Alert.alert('Invalid Format', 'Please enter duration in hh:mm:ss format (e.g. 02:30:00)');
                                                return;
                                            }

                                            const [hh, mm, ss] = txt.split(':').map(Number);
                                            const totalHours = hh + mm / 60 + ss / 3600;


                                        }}
                                        style={{
                                            borderBottomWidth: 1,
                                            borderRadius: 5,
                                            padding: 10,
                                            borderColor: '#ddd',
                                            fontSize: calculatefontSize(1.8),
                                            color: COLORS.PRIMARY_COLOR
                                        }}
                                    />






                                    {/* ====================================> DROP DOWN MODAL <================================================= */}
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isOpenMatter', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('matterObj', item);
                                                    setFieldValue('matter', item?.name || '');
                                                    setFieldValue('isOpenMatter', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.name}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isOpenMatter}
                                        data={matterData}
                                        searchKey="name"
                                    />
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isOpenFrom', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('fromObj', item);
                                                    setFieldValue('from', item?.userProfileDTO?.fullName || '');
                                                    setFieldValue('isOpenFrom', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.userProfileDTO?.fullName}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isOpenFrom}
                                        data={fromData}
                                        searchKey="email"
                                    />
                                    <BottomModalListWithSearch
                                        onClose={() => setFieldValue('isOpenTo', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('toObj', item);
                                                    setFieldValue('to', item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName);
                                                    setFieldValue('isOpenTo', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.companyName ? item?.companyName : item?.firstName + ' ' + item?.lastName}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isOpenTo}
                                        data={toData}
                                        searchKey="firstName"
                                    />

                                    <DatePicker
                                        modal
                                        mode='date'
                                        open={values.isdateOpen}
                                        date={new Date()}
                                        onConfirm={date => {
                                            setFieldValue('selecteddate', date?.toISOString())
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
                                    <DatePicker
                                        modal
                                        mode='time'
                                        open={values.isTimeOpen}
                                        date={new Date()}
                                        onConfirm={date => {
                                            setFieldValue('selectedtime', date?.toISOString())
                                            setFieldValue('isTimeOpen', false);
                                            setFieldValue(
                                                'time',
                                                moment(date).format('hh:mm A'),
                                            );
                                        }}
                                        onCancel={() => {
                                            setFieldValue('isTimeOpen', false);
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

export default CreatePhoneLog

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
    btnTextStyle: {
        fontSize: calculatefontSize(1.9),
        fontWeight: '600',
        bottom: 10,
        color: COLORS?.PRIMARY_COLOR_LIGHT
    },
})