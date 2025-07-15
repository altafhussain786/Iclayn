import { AppState, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenHeader from '../../../components/ScreenHeader'
import Wrapper from '../../../components/Wrapper'
import MyText from '../../../components/MyText'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Formik } from 'formik'
import * as Yup from 'yup'
import TextInputWithTitle from '../../../components/TextInputWithTitle'
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch'
import { COLORS } from '../../../constants'
import { calculatefontSize } from '../../../helper/responsiveHelper'
import httpRequest from '../../../api/apiHandler'
import moment from 'moment'
import DatePicker from 'react-native-date-picker';
import LinearGradient from 'react-native-linear-gradient'
import AsyncStorage from '@react-native-async-storage/async-storage'
const TIMER_KEY = 'TIMEKEEPER_STATE';

const EditTimeEntry = ({ navigation }) => {
    const [matterData, setmatterData] = React.useState([]);
    const [firmData, setfirmData] = React.useState([]);
    //TIMMER
    const [duration, setDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [description, setDescription] = useState('No description');
    const [matter, setMatter] = useState('No matter');
    const intervalRef = useRef(null);


    useEffect(() => {
        loadTimer();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                loadTimer(); // recalculate time when returning to app
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const loadTimer = async () => {
        const json = await AsyncStorage.getItem(TIMER_KEY);
        if (json) {
            const data = JSON.parse(json);
            setDescription(data.description || 'No description');
            setMatter(data.matter || 'No matter');
            setIsRunning(data.isRunning || false);
            setStartTime(data.startTime || null);

            if (data.isRunning && data.startTime) {
                const elapsed =
                    Math.floor((Date.now() - new Date(data.startTime).getTime()) / 1000) +
                    (data.duration || 0);
                setDuration(elapsed);
                startTimer(true);
            } else {
                setDuration(data.duration || 0);
            }
        }
    };

    const saveTimerState = async (extra = {}) => {
        const data = {
            description,
            matter,
            duration,
            isRunning,
            startTime,
            ...extra,
        };
        console.log(data, "Timmer details");

        await AsyncStorage.setItem(TIMER_KEY, JSON.stringify(data));
    };

    const startTimer = async (resume = false) => {
        const start = resume ? startTime : new Date().toISOString();
        if (!resume) {
            setStartTime(start);
            await saveTimerState({ isRunning: true, startTime: start });
        }
        setIsRunning(true);
        console.log('⏱ Timer started');

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        console.log('⏸ Timer stopped');
        await saveTimerState({ isRunning: false, duration });
    };

    const toggleTimer = () => {
        isRunning ? stopTimer() : startTimer();
    };

    const formatTime = (sec) => {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };



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
        duration: Yup.string()
            .required('Duration is required')
            .matches(
                /^(\d{1,2}h\s?\d{1,2}m\s?\d{1,2}s)$/,
                'Duration must be in format like 1h12m13s or 1h 12m 13s'
            ),
    })



    return (
        <>
            <Formik
                enableReinitialize
                initialValues={
                    {
                        //matter details
                        matter: '',
                        matterItems: [],
                        matterObj: {},
                        isOpenmatter: false,

                        description: '',

                        //Duration
                        duration: formatTime(duration),

                        //Date
                        date: moment().format('DD/MM/YYYY'),
                        selectedDate: moment().format('MM/DD/YYYY'),
                        isdateOpen: false,

                        //Firm Data
                        firmData: "",
                        firmItems: [],
                        firmObj: {},
                        isOpenfirm: false,

                        //rate
                        rate: '',

                        nonBillable: false,
                        isShowEntryontheBill: false,
                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(values);

                    const payload = {
                        amount: Number(values.rate),
                        billed: false,
                        createdBy: 1,
                        createdOn: "",
                        description: "Time entry",
                        duration: "00:47:41",
                        entryDate: "2025-07-09T17:02:35+05:00",
                        firmUserId: 1,
                        matterId: 13,
                        matterName: "",
                        matterTimeEntryId: null,
                        module: "DASHBOARD",
                        nonBillable: false,
                        rate: Number(values.rate),
                        revision: null,
                        updatedBy: null,
                        updatedOn: null,
                        visibleBill:
                            false,
                    }

                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Edit Time Entry" />
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
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, paddingVertical: 10, }}>
                                    <View style={{ width: "60%" }}>
                                        <MyText style={{
                                            marginBottom: 10, color: '#627585',
                                            // marginBottom: 5,
                                            fontWeight: '600',
                                        }}>Duration <MyText style={{ color: COLORS?.RED_COLOR }}>*</MyText></MyText>
                                        <TextInput
                                            editable={isRunning ? false : true}
                                            value={values.duration}
                                            onChangeText={(txt) => setFieldValue('duration', txt)}
                                            style={{ borderWidth: 1, borderColor: COLORS?.LIGHT_COLOR, borderRadius: 15, backgroundColor: isRunning ? COLORS?.LIGHT_COLOR : COLORS?.whiteColors, paddingHorizontal: 10, fontWeight: '500' }}
                                            placeholderTextColor={COLORS?.LIGHT_COLOR}
                                            placeholder='Duration'
                                        />
                                    </View>
                                    <LinearGradient
                                        colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ width: "35%", borderRadius: 15, padding: 10, top: 10, }}
                                    >
                                        <TouchableOpacity onPress={toggleTimer} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 }}>
                                            <FontAwesome name={isRunning ? 'pause' : 'play'} size={16} color="white" />
                                            <MyText style={{ color: COLORS?.whiteColors }}>{formatTime(duration)}</MyText>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                </View>
                                {errors.duration && touched.duration && <MyText style={{ color: 'red' }}>{errors.duration}</MyText>}
                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isdateOpen', true)}
                                    title="Open Date"
                                    isButton={true}
                                    buttonText={values.date ? values.date : 'Select Open date'}
                                />
                                <TextInputWithTitle onChangeText={(txt) => setFieldValue('description', txt)} title=" Description" placeholder={'Enter description'} />

                                <TextInputWithTitle
                                    onPressButton={() => setFieldValue('isOpenfirm', true)}
                                    title="Fir User"
                                    isRequired={true}
                                    isButton={true}
                                    buttonText={values.firmData ? values.firmData : 'Select Firm user'}
                                />
                                {
                                    errors.firmData && touched.firmData && <MyText style={{ color: 'red' }}>{errors.firmData}</MyText>
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

export default EditTimeEntry

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