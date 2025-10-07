import { Alert, Animated, Dimensions, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker';
import { useToast } from 'react-native-toast-notifications'


import ScreenHeader from '../../../components/ScreenHeader'
import Wrapper from '../../../components/Wrapper'
import MyText from '../../../components/MyText'
import TextInputWithTitle from '../../../components/TextInputWithTitle'
import { calculatefontSize } from '../../../helper/responsiveHelper'
import { COLORS } from '../../../constants'
import AddButton from '../../../components/AddButton'
import httpRequest from '../../../api/apiHandler'
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch'
import ReminderItems from '../../tabs/tasks/components/ReminderItems'
import { addReminderItem, resetReminderItems } from '../../../store/slices/taskSlice/createItemforReminder'
import { resetRepeat, setRepeat } from '../../../store/slices/eventSlice/createItemForAddRepeat'



//icons 
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoaderModal from '../../../components/LoaderModal'




const EditEvents = ({ navigation, route }) => {
    const eventData = route?.params?.eventData
    const editType = route?.params?.editType
    const dispatch = useDispatch()
    const toast = useToast();
    const [firmUserData, setFirmUserData] = useState([])
    const items = useSelector(state => state.createItemforReminder.items);
    const repeatItem = useSelector(state => state.createItemForAddRepeat.repeatObj);
    const [loader, setLoader] = useState(false)

    const [matterData, setmatterData] = React.useState([]);
    const [eventTypeData, seteventTypeData] = React.useState([]);
    const [billingData, setBillingData] = React.useState([]);
    const [partyData, setPartyData] = React.useState([]);
    // inside Event component
    const [searchQuery, setSearchQuery] = useState("");
    const userDetails = useSelector(state => state?.userDetails?.userDetails);


    const repeadData = [
        { id: 1, name: "Daily", value: 'days' },
        { id: 2, name: "Weekly", value: 'weeks' },
        { id: 3, name: "Monthly", value: 'month' },
    ]

    ///NEW STATE=========================>

    const [initialValues, setInitialValues] = useState({

        title: '',

        //attendee ids
        firmUser: '',
        // firmItems: [],
        firmItems: [],
        firmUserObj: {},
        isOpenFirmUser: false,

        //start data/time
        isOpenStartDate: false,
        startDate: '',
        startDateSelected: new Date(),
        selectedStartDate: new Date(), // 👈 must be a Date object

        //end date/time
        isOpenEndDate: false,
        endDate: '',
        endDateSelected: new Date(),
        selectedEndDate: new Date(),

        location: "",

        //isreaped
        isRepeated: false,
        // matterselect 
        matterSelected: '',
        matterSelectedObj: {},
        isOpenMatterSelected: false,

        //Assign to
        client: '',
        clientItems: [],
        clientObj: {},
        isOpenClient: false,

        //isInclude
        isInclude: false,

        //Event type 
        eventTypeSelected: '',
        eventTypeSelectedObj: {},
        isOpenEventType: false,

        //description
        description: '',
        //loader
        loader: false
    });
    // ===================================>

    // Filtered Lists
    const filteredBilling = billingData?.filter((item) => {
        const text = searchQuery.toLowerCase();
        return (
            item?.companyName?.toLowerCase().includes(text) ||
            item?.userProfileDTO?.fullName?.toLowerCase().includes(text) ||
            item?.email?.toLowerCase().includes(text)
        );
    });

    const filteredParties = partyData?.filter((item) => {
        const text = searchQuery.toLowerCase();
        return (
            item?.companyName?.toLowerCase().includes(text) ||
            (item?.firstName + " " + item?.lastName)?.toLowerCase().includes(text)
        );
    });
    const getRepeatData = async () => {

        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/event/${eventData?.eventId}`,
            navigation: navigation
        })
        if (res) {
            const repeatType = res?.data?.repeatType;

            const matchedRepeatObj = repeadData?.find(opt =>
                (repeatType === "day" && opt.value === "days") ||
                (repeatType === "week" && opt.value === "weeks") ||
                (repeatType === "month" && opt.value === "month")
            );
            console.log(res, "REPEATd DATAd Singles", res?.data?.eventScheduleDTOList?.length);
            if (editType !== "single") {
                if (res?.data?.eventScheduleDTOList?.length > 1) {
                    dispatch(setRepeat({
                        repeat: res?.data?.repeatType == "day" ? "Daily" : res?.data?.repeatType == "week" ? "Weekly" : res?.data?.repeatType == "month" ? "Monthly" : "",
                        every: String(res?.data?.every) || "",
                        endType: res?.data?.endType == "on" ? "On" : res?.data?.endType == "after" ? "After" : "Never",
                        endOccurrences: String(res?.data?.occurrences) || "",
                        endDate: res?.data?.eventEndDate || "",
                        isRepeatObj: matchedRepeatObj || {},

                    }))

                }
                else {
                    dispatch(setRepeat({}))
                }
            }
            else {

                dispatch(setRepeat({}))
            }
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>event", `/ic/event/${eventData?.eventId}`);
        }
    }

    useEffect(() => {
        if (editType !== "single") {
            getRepeatData()
        }
        else {
            dispatch(setRepeat({}))
        }
    }, [])


    useEffect(() => {
        setLoader(true)
        if (
            billingData.length > 0 &&
            partyData.length > 0 &&
            eventData
        ) {

            const userIds = eventData?.attendeeUserIds
                ? eventData.attendeeUserIds.split(',').filter(Boolean)
                : [];

            const partyIds = eventData?.attendeePartyIds
                ? eventData.attendeePartyIds.split(',').filter(Boolean)
                : [];

            // 🔹 Filter users and parties from API data using IDs
            const matchedBillingUsers = billingData
                .filter(user => userIds.includes(user.userId?.toString()))
                .map(user => ({
                    ...user,
                    type: 'billing',
                }));

            const matchedParties = partyData
                .filter(party => partyIds.includes(party.partyId?.toString()))
                .map(party => ({
                    ...party,
                    type: 'party',
                }));


            const clientIds = eventData?.calenderUserIds
                ? eventData.calenderUserIds.split(',').filter(Boolean)
                : [];

            const matchedClients = billingData
                ?.filter(user => clientIds.includes(user.userId?.toString()))
                ?.map(user => ({
                    ...user,
                    type: 'client',
                }));

            if (eventData?.eventReminderDTOList?.length > 0) {
                eventData?.eventReminderDTOList?.forEach(item => {
                    dispatch(addReminderItem({
                        rId: Math.floor(Math.random() * 1000),
                        reminderThrough: item?.durationType || '',  // e.g. 'email', 'sms'
                        counts: item?.duration || 0,
                        eventReminderId: item?.eventReminderId || null,
                        reminderType: item?.type || '',
                        reminderObj: item
                    }))
                })
            }


            // 🔹 Set the Formik initial values dynamically
            setInitialValues(prev => ({
                ...prev,
                title: eventData.title || '',
                firmItems: [...matchedBillingUsers, ...matchedParties],
                startDate: moment(eventData?.eventScheduleDTOList[0]?.startOnDate)?.format('YYYY-MM-DD') || '',
                startDateSelected: eventData?.eventScheduleDTOList[0]?.startOnDate || '',
                endDate: moment(eventData?.eventScheduleDTOList[0]?.endOnDate)?.format('YYYY-MM-DD') || '',
                endDateSelected: eventData?.eventScheduleDTOList[0]?.endOnDate || '',
                location: eventData.location || '',
                matterSelected: matterData?.find(item => item?.matterId === eventData?.matterId)?.name || '',
                matterSelectedObj: matterData?.find(item => item?.matterId === eventData?.matterId) || {},

                //Asign to
                client: matchedClients?.map(c => c?.userProfileDTO?.fullName)?.join(', ') || '',
                clientItems: matchedClients || [],
                clientObj: {},

                //isInclude
                isInclude: eventData?.includeFcSc || false,

                //Event type 
                eventTypeSelected: eventTypeData?.find(item => item?.eventTypeId === eventData?.typeId)?.name || '',
                eventTypeSelectedObj: eventTypeData?.find(item => item?.eventTypeId === eventData?.typeId) || {},
                //description
                description: eventData?.description || '',
            }));
            setLoader(false)

        }
        setLoader(false)

    }, [billingData, partyData, eventData]);


    // console.log(eventData, "eventData");



    const getMatterData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/listing`,
            navigation: navigation
        })
        if (res) {
            // console.log(res,"practive arae");
            setmatterData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER REdSPONSE===>err");

        }
    }
    const getEventTypeData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/event-type/?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res,"practive arae");
            seteventTypeData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }


    const getBillingData = async () => {

        try {
            const [customerResponse, anotherResponse] = await Promise.all([
                httpRequest({
                    method: 'get',
                    path: '/ic/user/?status=Active',
                    navigation: navigation
                }),
                httpRequest({
                    method: 'get',
                    path: '/ic/party/?status=Active', // yeh second API ka actual path daalna hoga
                    navigation: navigation
                })
            ]);
            if (customerResponse?.res) {
                setBillingData(customerResponse.res.data);
            } else {
                console.log(customerResponse?.err, 'GET CUSTOMER dRESPONSE===>err');
            }
            if (anotherResponse?.res) {
                setPartyData(anotherResponse.res.data); // is function ko aapko useState se define karna hoga
            } else {
                console.log(anotherResponse?.err, 'SECOND API RESPONSE===>err');
            }

        } catch (error) {
            console.log('Unexpected error in Promise.all =>', error);
        }

    }

    //get users 
    const getFirmUserData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res,"practive arae");
            setFirmUserData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }

    const getAllData = async () => {
        try {
            setLoader(true);

            await Promise.all([
                getEventTypeData(),
                getBillingData(),
                getMatterData(),
                getFirmUserData(),
                editType !== "single" ? getRepeatData() : Promise.resolve()
            ]);

        } catch (error) {
            console.log("Error loading data:", error);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        getAllData();
    }, []);
    // useEffect(() => {
    //     setLoader(true)
    //     getEventTypeData()
    //     getBillingData()
    //     getMatterData()
    //     getFirmUserData()
    //     setLoader(false)

    // }, [])


    console.log(billingData);


    const validationSchema = Yup.object().shape({
        title: Yup.string().required('title is required'),
    })
    return (
        <>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {

                    const mappedEventReminder = items?.map((d, i) => {
                        return {
                            createdBy: null,
                            createdOn: d?.reminderObj?.createdOn || null,
                            duration: d?.counts || 0,
                            durationType: d?.reminderType || "",
                            eventReminderId: d?.reminderObj?.eventReminderId || null,
                            revision: null,
                            type: d?.reminderThrough || "",
                            updatedBy: userDetails?.userId || 0,
                            updatedOn: d?.reminderObj?.updatedOn || null
                        }
                    })

                    console.log(mappedEventReminder, "mappedEventReminder", eventData);
                    let updatedPayload = { attendeeUserIds: "", attendeePartyIds: "", };

                    if (editType === 'single') {
                        updatedPayload = {
                            attendeeUserIds: values?.firmItems
                                ?.filter(v => v?.type === "billing")
                                ?.map(v => v?.userId)
                                ?.filter(Boolean)
                                ?.join(",") || "",

                            attendeePartyIds: values?.firmItems
                                ?.filter(v => v?.type === "party")
                                ?.map(v => v?.partyId)
                                ?.filter(Boolean)
                                ?.join(",") || "",
                            calenderUserIds: values?.clientItems
                                ?.map(v => v?.userId)
                                ?.filter(Boolean)
                                ?.join(",") || "",
                            // eventId: eventData?.eventId || null,
                            code: eventData?.code || null,
                            createdBy: eventData?.createdBy || null,
                            createdOn: eventData?.createdOn || null,
                            description: values?.description || "",
                            // endType: "",
                            // eventEndDate: "",
                            // every: 0,
                            matterId: values?.matterSelectedObj?.matterId || 0,
                            includeFcSc: values?.isInclude || false,
                            location: values?.location || "",
                            // occurrences: 0,
                            // repeatType: "",
                            revision: null,
                            title: values?.title || "",
                            typeId: values?.eventTypeSelectedObj?.eventTypeId || null,
                            updatedBy: userDetails?.userId || null,
                            updatedOn: eventData?.updatedOn || null,
                            startOnDate: values?.startDateSelected,
                            startOnTime: values?.startDateSelected,
                            endOnDate: values?.endDateSelected,
                            endOnTime: values?.endDateSelected,
                            //new states
                            eventScheduleId: eventData?.eventScheduleDTOList[
                                0
                            ]?.eventScheduleId || null,
                        };
                    }

                    else {
                        if (!Object.keys(repeatItem).length > 0) {
                            console.log('!Object.keys(repeatItem).length > 0');

                            updatedPayload = {
                                attendeeUserIds: values?.firmItems
                                    ?.filter(v => v?.type === "billing")
                                    ?.map(v => v?.userId)
                                    ?.filter(Boolean)
                                    ?.join(",") || "",

                                attendeePartyIds: values?.firmItems
                                    ?.filter(v => v?.type === "party")
                                    ?.map(v => v?.partyId)
                                    ?.filter(Boolean)
                                    ?.join(",") || "",
                                calenderUserIds: values?.clientItems
                                    ?.map(v => v?.userId)
                                    ?.filter(Boolean)
                                    ?.join(",") || "",
                                eventId: eventData?.eventId || null,
                                code: eventData?.code || null,
                                createdBy: eventData?.createdBy || null,
                                createdOn: eventData?.createdOn || null,
                                description: values?.description || "",
                                endType: "",
                                eventEndDate: "",
                                every: 0,
                                matterId: values?.matterSelectedObj?.matterId || 0,
                                includeFcSc: values?.isInclude || false,
                                location: values?.location || "",
                                occurrences: 0,
                                repeatType: "",
                                revision: null,
                                title: values?.title || "",
                                typeId: values?.eventTypeSelectedObj?.eventTypeId || null,
                                updatedBy: userDetails?.userId || null,
                                updatedOn: eventData?.updatedOn || null,

                                eventReminderDTOList: mappedEventReminder || [],
                                eventScheduleDTOList: [{
                                    createdOn: eventData?.createdOn || null,
                                    updatedOn: eventData?.updatedOn || null,
                                    createdBy: eventData?.createdBy || null,
                                    updatedBy: userDetails?.userId || null,
                                    revision: null,
                                    eventScheduleId: null,
                                    startOnDate: values?.startDateSelected,
                                    startOnTime: moment(values?.startDateSelected)
                                        .set({
                                            hour: moment(values?.startDateSelected, "HH:mm").hours(),
                                            minute: moment(values?.startDateSelected, "HH:mm").minutes(),
                                        }).toISOString(),
                                    endOnDate: values?.endDateSelected,
                                    endOnTime: moment(values?.endDateSelected)
                                        .set({
                                            hour: moment(values?.endDateSelected, "HH:mm").hours(),
                                            minute: moment(values?.endDateSelected, "HH:mm").minutes(),
                                        }).toISOString(),
                                    code: eventData?.code || null,

                                    title: values?.title || "",
                                    location: values?.location || "",
                                    matterId: values?.matterSelectedObj?.matterId || null,
                                    typeId: values?.eventTypeSelectedObj?.eventTypeId || null,
                                    description: values?.description || "",

                                    attendeeUserIds: values?.firmItems
                                        ?.filter(v => v?.type === "billing")
                                        ?.map(v => v?.userId)
                                        ?.filter(Boolean)
                                        ?.join(",") || "",
                                    attendeePartyIds: values?.firmItems
                                        ?.filter(v => v?.type === "party")
                                        ?.map(v => v?.partyId)
                                        ?.filter(Boolean)
                                        ?.join(",") || "",
                                    calenderUserIds: values?.clientItems
                                        ?.map(v => v?.userId)
                                        ?.filter(Boolean)
                                        ?.join(",") || "",
                                    includeFcSc: values?.isInclude || false,
                                }],
                            };
                        }
                        else {
                            console.log('!Object.keys(repeatItem).length ================>ELSE');
                            updatedPayload = {
                                attendeeUserIds: values?.firmItems
                                    ?.filter(v => v?.type === "billing")
                                    ?.map(v => v?.userId)
                                    ?.filter(Boolean)
                                    ?.join(",") || "",

                                attendeePartyIds: values?.firmItems
                                    ?.filter(v => v?.type === "party")
                                    ?.map(v => v?.partyId)
                                    ?.filter(Boolean)
                                    ?.join(",") || "",
                                calenderUserIds: values?.clientItems
                                    ?.map(v => v?.userId)
                                    ?.filter(Boolean)
                                    ?.join(",") || "",
                                eventId: eventData?.eventId || null,
                                code: eventData?.code || null,
                                createdBy: eventData?.createdBy || null,
                                createdOn: null,
                                description: values?.description || "",
                                endType: repeatItem?.endType?.toLocaleLowerCase() || "",
                                eventEndDate: "",
                                every: Number(repeatItem?.every || 0),
                                matterId: values?.matterSelectedObj?.matterId || 0,
                                includeFcSc: values?.isInclude || false,
                                location: values?.location || "",
                                occurrences: Number(repeatItem?.endOccurrences || 0),
                                repeatType: repeatItem?.isRepeatObj?.value?.endsWith("s") ? repeatItem?.isRepeatObj?.value.slice(0, -1) : repeatItem?.isRepeatObj?.value || "",
                                revision: null,
                                title: values?.title || "",
                                typeId: values?.eventTypeSelectedObj?.eventTypeId || null,
                                updatedBy: userDetails?.userId || null,
                                updatedOn: null,

                                eventReminderDTOList: mappedEventReminder || [],
                                eventScheduleDTOList: [],
                            };

                            console.log(repeatItem, "dsfhldsfkdjfdk");

                            const frequency = Number(repeatItem?.every || 1); // every like a 1,2,3 and so on,
                            let maxOccurrences = 0;
                            // Determine max occurrences based on endType
                            if (repeatItem?.endType === "Never") {
                                if (repeatItem?.isRepeatObj?.value === "days") {
                                    maxOccurrences = Math.floor((3 * 365) / frequency); // 3 years of days
                                } else if (repeatItem?.isRepeatObj?.value === "weeks") {
                                    maxOccurrences = Math.floor((3 * 52) / frequency); // 3 years of weeks
                                } else if (repeatItem?.isRepeatObj?.value === "month") {
                                    maxOccurrences = Math.floor((3 * 12) / frequency); // 3 years of months
                                }
                            } else if (repeatItem?.endType === "After") {
                                maxOccurrences = Number(repeatItem?.endOccurrences || 0);
                            } else if (repeatItem?.endType === "On") {
                                const endDate = moment(repeatItem?.endDate);
                                maxOccurrences = Math.floor((endDate.diff(values?.startDateSelected, "days") + 2) / frequency); // Add 1 to include both start and end dates
                            }
                            for (let i = 0; i < maxOccurrences; i++) {
                                let nextDate = null;

                                if (repeatItem?.isRepeatObj?.value === "days") {
                                    console.log(values?.startDateSelected, "values?.startDateSelected", frequency, "frequency");

                                    nextDate = moment(values?.startDateSelected).clone().add(i * frequency, "day");
                                } else if (repeatItem?.isRepeatObj?.value === "weeks") {
                                    nextDate = moment(values?.startDateSelected).clone().add(i * frequency, "week");
                                } else if (repeatItem?.isRepeatObj?.value === "month") {
                                    nextDate = moment(values?.startDateSelected).clone().add(i * frequency, "month");
                                }
                                console.log(nextDate, "nextDate");

                                if (nextDate) {
                                    updatedPayload.eventScheduleDTOList.push({
                                        createdOn: eventData?.createdOn || null,
                                        updatedOn: eventData?.updatedOn || null,
                                        createdBy: eventData?.createdBy || null,
                                        updatedBy: userDetails?.userId || null,
                                        revision: null,
                                        eventScheduleId: null,
                                        startOnDate: nextDate.toISOString(),
                                        startOnTime: moment(nextDate.toISOString())
                                            .set({
                                                hour: moment(values?.startDateSelected, "HH:mm").hours(),
                                                minute: moment(values?.startDateSelected, "HH:mm").minutes(),
                                            }).toISOString(),
                                        endOnDate: nextDate.toISOString(),
                                        endOnTime: moment(nextDate.toISOString())
                                            .set({
                                                hour: moment(values?.startDateSelected, "HH:mm").hours(),
                                                minute: moment(values?.startDateSelected, "HH:mm").minutes(),
                                            }).toISOString(),
                                        code: eventData?.code || null,
                                        title: values.title,
                                        location: values.location,
                                        matterId: values?.matterSelectedObj?.matterId || null,
                                        typeId: values?.eventTypeSelectedObj?.eventTypeId || null,
                                        description: values?.description || "",

                                        attendeeUserIds: values?.firmItems
                                            ?.filter(v => v?.type === "billing")
                                            ?.map(v => v?.userId)
                                            ?.filter(Boolean)
                                            ?.join(",") || "",
                                        attendeePartyIds: values?.firmItems
                                            ?.filter(v => v?.type === "party")
                                            ?.map(v => v?.partyId)
                                            ?.filter(Boolean)
                                            ?.join(",") || "",
                                        calenderUserIds: values?.clientItems
                                            ?.map(v => v?.userId)
                                            ?.filter(Boolean)
                                            ?.join(",") || "",
                                        includeFcSc: values?.isInclude || false,
                                    });
                                }
                            }
                        }

                    }

                    console.log(updatedPayload, "updatedPayload ===============================>#########################################################################>", editType == "single" ? `/ic/event/schedule` : `/ic/event/`);
                    // const { res, err } = await httpRequest({
                    //     method: `posputt`,
                    //     path: editType == "single" ? `/ic/event/schedule` : `/ic/event/`,
                    //     params: updatedPayload,
                    //     navigation: navigation,

                    // });
                    // if (res) {
                    //     console.log(res, "practive arae");
                    //     toast.show('Event created successfully', { type: 'success' })
                    //     navigation.goBack();
                    // }
                    // else {
                    //     console.log(err, "GET CUSTOMER RESPONSE===>err");
                    // }






                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title={`Edit Event${editType}`} />
                        <Wrapper>
                            <LoaderModal visible={loader} />
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

                                    <TextInputWithTitle title='Title' value={values.title} onChangeText={(txt) => setFieldValue('title', txt)} placeholder={'Title'} isRequired={true} />
                                    {
                                        errors.title && touched.title && (
                                            <MyText style={{ color: 'red' }}>{errors.title}</MyText>
                                        )
                                    }
                                    <TextInputWithTitle
                                        setFieldValue={setFieldValue}
                                        arrayValue={values?.firmItems}
                                        onPressButton={() => setFieldValue('isOpenFirmUser', true)}
                                        isRequired={true}
                                        title="Invite attendees"
                                        isButton={true}
                                        buttonText={'Find firm users or contacts to invite'}
                                        customView={({ arrayValue, setFieldValue, onPressButton, buttonText }) => (
                                            <View style={{ marginTop: 10 }}>

                                                {/* Billing Users Section */}
                                                {arrayValue?.filter(item => item.type === 'billing').length > 0 && (
                                                    <>
                                                        <MyText style={{ fontWeight: 'bold', marginVertical: 5 }}>Billing Users</MyText>
                                                        {arrayValue?.filter(item => item.type === 'billing').map((item) => (
                                                            <View key={item.userId} style={styles.itemContainer}>
                                                                <MyText>{item?.userProfileDTO?.fullName || item?.companyName}</MyText>
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        const updatedList = arrayValue?.filter((c) => c.userId !== item.userId);
                                                                        setFieldValue('firmItems', updatedList);
                                                                    }}
                                                                >
                                                                    <AntDesign name="delete" size={20} color="red" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ))}
                                                    </>
                                                )}

                                                {/* Parties Section */}
                                                {arrayValue?.filter(item => item.type === 'party').length > 0 && (
                                                    <>
                                                        <MyText style={{ fontWeight: 'bold', marginVertical: 5 }}>Parties</MyText>
                                                        {arrayValue?.filter(item => item.type === 'party').map((item) => (


                                                            <View key={item.userId} style={styles.itemContainer}>
                                                                <MyText>
                                                                    {item?.companyName || `${item?.firstName} ${item?.lastName}`}
                                                                </MyText>
                                                                <TouchableOpacity
                                                                    // onPress={() => {
                                                                    //     const updatedList = arrayValue?.filter(
                                                                    //         (c) => !(c.uniqueKey === item.uniqueKey && c.type === 'party')
                                                                    //     );
                                                                    //     setFieldValue('firmItems', updatedList);
                                                                    // }}
                                                                    onPress={() => {


                                                                        const updatedList = arrayValue?.filter(
                                                                            c =>
                                                                                !(
                                                                                    (c.partyId === item.partyId || c.uniqueKey === item.uniqueKey) &&
                                                                                    c.type === 'party'
                                                                                )
                                                                        );
                                                                        setFieldValue('firmItems', updatedList);
                                                                    }}
                                                                >
                                                                    <AntDesign name="delete" size={20} color="red" />
                                                                </TouchableOpacity>
                                                            </View>
                                                        ))}
                                                    </>
                                                )}

                                                {/* Add button */}
                                                <TouchableOpacity onPress={onPressButton} style={{ paddingVertical: 10 }}>
                                                    <MyText style={styles.btnTextStyle}>{buttonText}</MyText>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                    <TextInputWithTitle
                                        title="Start Date/Time "
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.startDate || 'Select Start Date'}
                                        onPressButton={() => setFieldValue('isOpenStartDate', true)}
                                    />
                                    <TextInputWithTitle
                                        title="Start Date/Time "
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.endDate || 'Select End Date'}
                                        onPressButton={() => setFieldValue('isOpenEndDate', true)}
                                    />
                                    {editType !== 'single' && <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                                        <MyText style={styles.title}>Is Repeate ?</MyText>
                                        <TouchableOpacity onPress={() => {
                                            setFieldValue('isRepeated', true), navigation?.navigate(
                                                'AddRepeat'
                                            )
                                        }}>
                                            <AntDesign name="plus" size={20} color={Object.keys(repeatItem).length > 0 ? COLORS?.PRIMARY_COLOR_LIGHT : 'gray'} />
                                        </TouchableOpacity>
                                    </View>}
                                    {
                                        Object.keys(repeatItem).length > 0 &&
                                        <RepeatCard
                                            item={repeatItem}
                                            onEdit={() => navigation.navigate('AddRepeat', {
                                                paramData: {
                                                    repeat: repeatItem?.repeat || "",
                                                    every: repeatItem?.every || "",
                                                    endType: repeatItem?.endType || "Never",   // Default
                                                    endOccurrences: repeatItem?.endOccurrences || "", // only for "After"
                                                    endDate: repeatItem?.endDate || "",
                                                    isRepeatObj: repeatItem?.isRepeatObj || {},

                                                }
                                            })}
                                            onDelete={() => {
                                                setFieldValue('isRepeated', false),
                                                    dispatch(resetRepeat())
                                            }
                                            }
                                        />
                                    }

                                    {/* //Remider  */}
                                    <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                        <MyText style={styles.title}>Reminders</MyText>
                                        {
                                            items?.map((item, index) => {
                                                return (
                                                    <>
                                                        <ReminderItems item={item} navigation={navigation} />
                                                    </>
                                                )
                                            })

                                        }
                                        <AddButton onPress={() => dispatch(addReminderItem({
                                            rId: Math.floor(Math.random() * 1000),
                                        }))} title='Add new reminder' />
                                    </View>

                                    <TextInputWithTitle title='Location' value={values.location} onChangeText={(txt) => setFieldValue('location', txt)} placeholder={'Location'} />
                                    <TextInputWithTitle
                                        title="Matter"
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.matterSelected || 'Select Matter'}
                                        onPressButton={() => setFieldValue('isOpenMatterSelected', true)}
                                    />
                                    {
                                        errors.matterSelected && touched.matterSelected && (
                                            <MyText style={{ color: 'red' }}>{errors.matterSelected}</MyText>
                                        )
                                    }

                                    <TextInputWithTitle
                                        setFieldValue={setFieldValue}
                                        arrayValue={values?.clientItems}
                                        onPressButton={() => setFieldValue('isOpenClient', true)}
                                        isRequired={true}
                                        title="Assign to"
                                        isButton={true}
                                        buttonText={'Select Client'}
                                        customView={({ arrayValue, setFieldValue, onPressButton, buttonText }) => (

                                            <View style={{ marginTop: 10 }}>
                                                {arrayValue.map((item, index) => (
                                                    <View
                                                        key={item.userId}
                                                        style={styles.itemContainer}
                                                    >
                                                        <MyText>
                                                            {item?.userProfileDTO?.fullName}
                                                        </MyText>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                const updatedList = arrayValue.filter(
                                                                    (c) => c.userId !== item.userId
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
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                                        <MyText style={[styles.title, { width: "80%" }]}>Include this event in the firm calendar and the selected calendar ?</MyText>
                                        <Switch
                                            value={values.isInclude}
                                            onValueChange={(val) => setFieldValue('isInclude', val)}
                                            thumbColor={values.isInclude ? "#ffffff" : "#ffffff"}
                                            trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                                        />
                                    </View>

                                    <TextInputWithTitle
                                        title="Event type"
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.eventTypeSelected || 'Select Event Type'}
                                        onPressButton={() => setFieldValue('isOpenEventType', true)}
                                    />
                                    <TextInputWithTitle title='Description' value={values.description} onChangeText={(txt) => setFieldValue('description', txt)} placeholder={'Description'} />

                                    <View style={{ height: 20 }} />
                                </ScrollView>

                            </KeyboardAvoidingView>
                            {/* MODAL ======================================================================> */}
                            <BottomModalListWithSearch
                                onClose={() => setFieldValue('isOpenMatterSelected', false)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
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

                            <BottomModalListWithSearch
                                onClose={() => setFieldValue('isOpenClient', false)}
                                renderItem={({ item }) => (
                                    console.log(item, "ITEMS====>"),

                                    <TouchableOpacity
                                        onPress={() => {
                                            const alreadyExists = values.clientItems.find(
                                                (i) => i.userId === item.userId
                                            );
                                            if (!alreadyExists) {
                                                setFieldValue('clientItems', [...values.clientItems, item]);
                                            }
                                            else {
                                                Alert.alert('Client already added');
                                            }
                                            setFieldValue('clientObj', item);
                                            setFieldValue('client', item?.userProfileDTO?.fullName || '');
                                            setFieldValue('isOpenClient', false);
                                        }}
                                        style={styles.itemStyle}
                                    >
                                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                            {item?.userProfileDTO?.fullName}
                                        </MyText>
                                    </TouchableOpacity>
                                )}
                                visible={values?.isOpenClient}
                                data={billingData}
                                searchKey={"email"}
                            />


                            <Modal statusBarTranslucent transparent visible={values?.isOpenFirmUser} animationType="none">
                                <View style={styles.overlay}>
                                    <View style={[styles.modalContainer]}>
                                        <View style={styles.header}>
                                            <Text style={styles.title1}>Search</Text>
                                            <TouchableOpacity onPress={() => setFieldValue('isOpenFirmUser', false)}>
                                                <AntDesign name="closecircle" size={20} color="red" />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Search Input */}
                                        <TextInput
                                            placeholderTextColor={COLORS?.LIGHT_COLOR}
                                            style={styles.searchInput}
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChangeText={(txt) => setSearchQuery(txt)}
                                        />

                                        <ScrollView showsVerticalScrollIndicator={false}>
                                            {/* Firm Users Section */}
                                            <Text style={styles.title1}>Firm USERS</Text>
                                            {filteredBilling.length > 0 ? (
                                                filteredBilling.map((item, i) => (
                                                    <TouchableOpacity
                                                        key={i}
                                                        onPress={() => {
                                                            const alreadyExists = values.firmItems.find(
                                                                (i) => i.userId === item.userId && i.type === 'billing'
                                                            );
                                                            if (!alreadyExists) {
                                                                setFieldValue('firmItems', [
                                                                    ...values.firmItems,
                                                                    { ...item, type: 'billing' }
                                                                ]);
                                                            } else {
                                                                toast.show('Billing User already added', { type: 'danger' });
                                                                // Alert.alert('Billing User already added');
                                                            }
                                                            setFieldValue('isOpenFirmUser', false);
                                                            setSearchQuery("");
                                                        }}
                                                        style={styles.itemStyle}
                                                    >
                                                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                            {item?.companyName || item?.userProfileDTO?.fullName}
                                                        </MyText>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                <MyText style={{ color: 'gray', padding: 10 }}>No Firm User found</MyText>
                                            )}

                                            {/* Parties Section */}
                                            <Text style={styles.title1}>PARTIES</Text>
                                            {filteredParties.length > 0 ? (
                                                filteredParties.map((item, i) => (
                                                    <TouchableOpacity
                                                        key={i}
                                                        onPress={() => {
                                                            const id = item.userId || item.partyId;
                                                            const alreadyExists = values.firmItems.find(
                                                                (i) => i.uniqueKey === id && i.type === 'party'
                                                            );

                                                            if (!alreadyExists) {
                                                                setFieldValue('firmItems', [
                                                                    ...values.firmItems,
                                                                    { ...item, type: 'party', uniqueKey: id }
                                                                ]);
                                                            } else {
                                                                toast.show('Party already added', { type: 'danger' });
                                                                // Alert.alert('Party already added');
                                                            }
                                                            setFieldValue('isOpenFirmUser', false);
                                                            setSearchQuery("");
                                                        }}
                                                        style={styles.itemStyle}
                                                    >
                                                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                            {item?.companyName ||
                                                                item?.userProfileDTO?.fullName ||
                                                                `${item?.firstName} ${item?.lastName}`}
                                                        </MyText>
                                                    </TouchableOpacity>
                                                ))
                                            ) : (
                                                <MyText style={{ color: 'gray', padding: 10 }}>No Party found</MyText>
                                            )}
                                        </ScrollView>
                                    </View>
                                </View>
                            </Modal>



                            <BottomModalListWithSearch
                                onClose={() => setFieldValue('isOpenEventType', false)}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setFieldValue('eventTypeSelected', item?.name);
                                            setFieldValue('eventTypeSelectedObj', item);
                                            setFieldValue('isOpenEventType', false)
                                        }}
                                        style={styles.itemStyle}
                                    >
                                        <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                            {item?.name}
                                        </MyText>
                                    </TouchableOpacity>
                                )}
                                visible={values?.isOpenEventType}
                                data={eventTypeData}
                                searchKey="name"
                            />
                            {/* //PICKER ============================> */}

                            {/* //select start date and time  */}
                            <DatePicker
                                modal
                                mode="datetime"
                                open={values.isOpenStartDate}
                                date={values.selectedStartDate ? new Date(values.selectedStartDate) : new Date()}
                                onConfirm={(date) => {
                                    setFieldValue(
                                        "startDate",
                                        `${moment(date).format("MM/DD/YYYY")} : ${moment(date).format("hh:mm A")}`
                                    );
                                    setFieldValue("selectedStartDate", new Date(date)); // ✅ Date object rakho
                                    setFieldValue('startDateSelected', moment(date).toISOString()); // ✅ Date object rakho
                                    setFieldValue("isOpenStartDate", false);
                                }}
                                onCancel={() => {
                                    setFieldValue("isOpenStartDate", false);
                                }}
                            />
                            <DatePicker
                                modal
                                mode='datetime'
                                open={values.isOpenEndDate}
                                date={values.selectedEndDate || new Date()}
                                onConfirm={date => {
                                    setFieldValue('endDate', `${moment(date).format('MM/DD/YYYY')} : ${moment(date).format('hh:mm A')}`);
                                    setFieldValue('selectedEndDate', date); // ✅ keep as Date object
                                    setFieldValue('endDateSelected', moment(date).toISOString()); // ✅ Date object rakho

                                    setFieldValue('isOpenEndDate', false);
                                }}
                                onCancel={() => {
                                    setFieldValue('isOpenEndDate', false);
                                }}
                            />
                        </Wrapper>
                    </>

                )}
            </Formik>

        </>
    )
}

const RepeatCard = ({ item, onEdit, onDelete }) => {
    return (
        <View style={styles.card1}>
            <View style={styles.header1}>
                <MyText style={styles.title1}>{item?.repeat || "No Repeat"}</MyText>

                <View style={styles.actions1}>
                    <TouchableOpacity onPress={onEdit} style={styles.iconBtn1}>
                        <AntDesign name="edit" size={18} color={COLORS.PRIMARY_COLOR_LIGHT} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => onDelete()} style={[styles.iconBtn1, { marginLeft: 10 }]}>
                        <MaterialIcons name="delete-outline" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.row1}>
                <MyText style={styles.label1}>Every:</MyText>
                <MyText style={styles.value1}>{item?.every || "—"} {item?.isRepeatObj?.value}</MyText>
            </View>

            <View style={styles.row1}>
                <MyText style={styles.label1}>End Type:</MyText>
                <MyText style={styles.value1}>{item?.endType || "—"}</MyText>
            </View>

            {item?.endType === "After" && (
                <View style={styles.row1}>
                    <MyText style={styles.label1}>End After:</MyText>
                    <MyText style={styles.value1}>{item?.endOccurrences || "—"} occurrences</MyText>
                </View>
            )}

            {item?.endType === "On" && (
                <View style={styles.row1}>
                    <MyText style={styles.label1}>End Date:</MyText>
                    <MyText style={styles.value1}>{moment(item?.endDate).format("DD/MM/YYYY") || "—"}</MyText>
                </View>
            )}
        </View>
    );
};


export default EditEvents

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


    //Modal list
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: Dimensions.get('window').height * 0.6,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title1: {
        fontSize: calculatefontSize(2),
        fontWeight: 'bold',
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
    listContainer: {
        paddingBottom: 20,
    },



    // =====================>
    card1: {
        backgroundColor: '#f3f3f3ff',
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
        borderColor: COLORS?.BORDER_LIGHT_COLOR,
        marginVertical: 10,

    },
    header1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title1: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS?.PRIMARY_TEXT || '#1A1A1A',
    },
    actions1: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn1: {
        padding: 4,
    },
    row1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    label1: {
        fontSize: calculatefontSize(1.5),
        color: '#000000ff',
    },
    value1: {
        fontSize: calculatefontSize(1.5),
        color: '#000',
        // fontWeight: '500',
    },
})