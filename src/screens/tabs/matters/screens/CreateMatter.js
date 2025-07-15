import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'

import ScreenHeader from '../../../../components/ScreenHeader'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import TextInputWithTitle from '../../../../components/TextInputWithTitle'
import moment from 'moment'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import { COLORS } from '../../../../constants'
import AddButton from '../../../../components/AddButton'
import { useDispatch, useSelector } from 'react-redux'
import { addRelatedContact } from '../../../../store/slices/matterSlice/createItemforRelateParties'
import RelatedPartiesItems from '../components/RelatedPartiesItems'
import BillingRateItem from '../components/BillingRateItem'
import { addBillingRate } from '../../../../store/slices/matterSlice/createItemForBillingRate'
import httpRequest from '../../../../api/apiHandler'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import DatePicker from 'react-native-date-picker';
import { useToast } from 'react-native-toast-notifications'




const CreateMatter = ({ navigation }) => {
    const dispatch = useDispatch()
    const toast = useToast();
    const items = useSelector(state => state.createItemforRelateParties.items);
    const itemsForBilling = useSelector(state => state.createItemForBillingRate.items);

    //CLients state===============
    const [clientData, setClientData] = React.useState([]);
    const [billingData, setBillingData] = React.useState([]);
    const [practiceAreaData, setPracticeAreaData] = React.useState([]);
    const [practiceAreaId, setPracticeAreaId] = React.useState('');
    const [taskGroupData, setTaskGroupData] = React.useState([]);
    const [referalData, setReferalData] = React.useState([]);

    //
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const userDetails = useSelector(state => state?.userDetails?.userDetails);

    // console.log(userDetails, "USER DETAILS=======>");


    const getClientData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/client/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setClientData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getPracticeArea = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/pa/?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res,"practive arae");

            setPracticeAreaData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getTaskGroupData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/tg/pa/${practiceAreaId}?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res, "Task group===============d=======d==>");
            setTaskGroupData(res?.data);
        }
        else {
            setTaskGroupData([]);
            console.log(err, "Task group========================>err");

        }
    }

    const getReferalData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/referral/?status=Active`,
            navigation: navigation
        })
        if (res) {
            console.log(res, "Task group===============d=======d==>");
            setReferalData(res?.data);
        }
        else {
            setReferalData([]);
            console.log(err, "Task group========================>err");

        }
    }


    const getBillingData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            // console.log(res?.data, "==>BIILLLIND DATA");

            setBillingData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }
    useEffect(() => {

        getTaskGroupData();
    }, [practiceAreaId])


    useEffect(() => {
        getReferalData();
        getPracticeArea();
        getBillingData();
        getClientData();
    }, [])


    const matterStatus = [
        {
            id: 1,
            name: 'Open',
            value: 'open'
        },
        {
            id: 2,
            name: 'Pending',
            value: 'pending'
        },
        {
            id: 3,
            name: 'Closed',
            value: 'closed'
        },
    ]
    const matterStage = [
        {
            id: 1,
            name: 'New',
            value: 'new'
        },
        {
            id: 2,
            name: 'In Progress',
            value: 'inprogress'
        },
        {
            id: 3,
            name: 'Completed',
            value: 'completed'
        },
    ]
    const billingMethod = [
        {
            id: 1,
            name: 'Hourly',
            value: 'hourly'
        },
        // {
        //     id: 2,
        //     name: 'Fixed fee details',
        //     value: 'fixedfeedetails'
        // },
        {
            id: 3,
            name: 'Contingency fee default',
            value: 'contingencyfeedefaults'
        },
    ]

    const userWithAccess = [
        {
            id: 1,
            name: 'Everyone',
            value: 'everyone'
        },
        {
            id: 2,
            name: 'Specificusers',
            value: 'specific'
        },

    ]
    const validationSchema = Yup.object().shape({
        client: Yup.string().required('Client is required'),
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),

    })
    return (
        <>

            <Formik
                initialValues={
                    {

                        //Client obj
                        client: '',
                        clientItems: [],
                        clientObj: {},
                        isOpenClient: false,
                        //end

                        title: '',
                        description: '',

                        openDate: moment().format('DD/MM/YYYY'),
                        selectedDate: moment().format('MM/DD/YYYY'),
                        isOpenDate: false,
                        // ==========================================================================>
                        // //Supervisor Solicitor
                        // supervisorSolicitor: '',
                        // supervisorSolicitorObj: {},
                        // isOpenSupervisorSolicitor: false,

                        // //Fee Earner Solicitor
                        // feeEarnerSolicitor: '',
                        // feeEarnerSolicitorObj: {},
                        // isOpenFeeEarnerSolicitor: false,
                        activeSolicitorType: '',
                        isOpenSolicitorModal: false,
                        feeEarnerSolicitor: '',
                        feeEarnerSolicitorObj: {},
                        supervisorSolicitor: '',
                        supervisorSolicitorObj: {},
                        // ==========================================================================></>
                        //clinet ref number
                        clientRefNumber: '',

                        //Matter Status
                        matterStatus: '',
                        matterStatusObj: {},
                        isOpenMatterStatus: false,

                        //Matter State
                        matterStage: '',
                        matterStageObj: {},
                        isOpenMatterStage: false,

                        location: '',

                        //Practice Area
                        practiceArea: '',
                        practiceAreaObj: {},
                        isOpenPracticeArea: false,

                        //Task group
                        taskGroup: '',
                        taskGroupObj: {},
                        isOpenTaskGroup: false,

                        userPermission: 'everyone',

                        //Matter Access
                        addUserPermission: '',
                        addUserItems: [],
                        addUserPermissionObj: {},
                        isOpenAddUserPermission: false,

                        //Matter Notification
                        matterNotificationUser: '',
                        matterNotificationItem: [],
                        matterNotificationUserObj: {},
                        isOpenMatterNotificationUser: false,

                        //Bill
                        isBillable: false,

                        //Billing Method
                        billingMethod: '',
                        billingMethodObj: {},
                        billingMethodValue: '',
                        isOpenBillingMethod: false,

                        //Matter budger
                        isMatterBudget: false,
                        budgetAmmount: "",

                        //Select Referal
                        selectReferal: '',
                        selectReferalItems: [],
                        selectReferalObj: {},
                        isOpenSelectReferal: false,

                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    // console.log(values?.clientItems, "========================================== selectReferalItems");

                    const mappedData = itemsForBilling?.map((item, index) => {
                        return {
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            matterBillingItemId: null,
                            userId: item?.firmUserObj?.userId || 0,
                            rate: item?.hourlyRate || 0,
                            fixedFeeCategory: null,
                        }
                    })

                    const mappedPerUser = values?.addUserItems?.map((item, index) => {
                        return {
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            matterPerUserId: null,
                            userId: item?.userId || 0,
                            email: item?.email || 0,
                            fullName: item?.userProfileDTO?.fullName || 0,
                        }
                    })
                    const mappedPerNotification = values?.matterNotificationItem?.map((item, index) => {
                        return {
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            matterPerNotifUserId: null,
                            userId: item?.userId || 0,
                            email: item?.email || 0,
                            fullName: item?.userProfileDTO?.fullName || 0,
                        }
                    })
                    const mappedmatterRelatedPar = items?.map((item, index) => {
                        return {
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            matterRelatedPartyId: null,
                            partyId: item?.partyId || null,
                            partyTypeId: item?.partyTypeId || null,
                            relationship: item?.relationship || '',
                        }
                    })
                    const matterRelatedParty = values?.selectReferalItems?.map((item, index) => {
                        return {
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            matterReferralId: null,
                            referralId: item?.referralId,
                        }
                    })
                    const payload = {
                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        matterId: 0,
                        clientIds: values?.clientItems?.map(v => v.clientId).join(','),
                        clientNames: values?.clientItems
                            ?.map(v =>
                                v?.type === 'Individual'
                                    ? `${v?.firstName} ${v?.lastName} `
                                    : v?.companyName
                            )
                            .join(', '),
                        name: values?.title,
                        code: null,
                        description: values?.description,
                        supervisorSolicitorId: values?.supervisorSolicitorObj?.userId || 0,
                        supervisorSolicitorName: values?.supervisorSolicitorObj?.userProfileDTO.fullName || "",
                        feeEarnerSolicitorId: values?.feeEarnerSolicitorObj?.userId || 0,
                        feeEarnerSolicitorName: values?.feeEarnerSolicitorObj?.userProfileDTO.fullName || "",
                        clientRefNo: values?.clientRefNumber || "",
                        location: values?.location || "",
                        status: values?.matterStatus || "Open",
                        stage: values?.matterStage || "New",
                        openDate: values?.selectedDate || "",

                        practiceAreaId: values?.practiceAreaObj?.practiceAreaId || 0,
                        practiceAreaName: values?.practiceAreaObj?.name || "",

                        // =============>RECHECK THIS</>
                        taskGroupId: values?.taskGroupObj?.taskGroupId || null,
                        // =============>RECHECK THIS</>

                        matterPermission: values?.userPermission?.toUpperCase() || "EVERYONE",
                        billable: values?.isBillable,
                        budgetSet: values?.isMatterBudget || false,
                        budgetAmount: values?.budgetAmmount || '0',
                        docProcessed: false,
                        matterBillingDTOList: [{
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            matterBillingId: null,
                            method: values?.billingMethodValue?.toUpperCase() || "HOURLY",
                            matterBillingItemDTOList: mappedData,
                        }],
                        matterPerUserDTOList: mappedPerUser,
                        matterPerNotifUserDTOList: mappedPerNotification,
                        matterRelatedPartyDTOList: mappedmatterRelatedPar,
                        matterReferralDTOList: matterRelatedParty,
                        depositAmount: null,
                    };
                    console.log(payload, 'Values =======================>')
                    setFieldValue('loader', true)
                    const { res, err } = await httpRequest({
                        method: 'post',
                        path: `/ic/matter/v1/`,
                        params: payload,
                        navigation: navigation
                    })
                    if (res) {
                        toast.show('Matter created successfully', { type: 'success' })
                        setFieldValue('loader', false)
                        navigation.goBack()
                    } else {
                        setFieldValue('loader', false)

                        console.log(err, 'ERR =======================>');

                    }
                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="New Matter" />
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
                                    <TextInputWithTitle
                                        setFieldValue={setFieldValue}
                                        arrayValue={values?.clientItems}
                                        onPressButton={() => setFieldValue('isOpenClient', true)}
                                        isRequired={true}
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
                                                            {item?.type === 'Individual'
                                                                ? `${item?.firstName} ${item?.lastName}`
                                                                : item?.companyName}
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
                                    {
                                        errors.client && touched.client && (
                                            <MyText style={{ color: 'red' }}>{errors.client}</MyText>
                                        )
                                    }

                                    <TextInputWithTitle onChangeText={(txt) => setFieldValue('title', txt)} placeholder={'Matter title'} isRequired={true} />
                                    {
                                        errors.title && touched.title && (
                                            <MyText style={{ color: 'red' }}>{errors.title}</MyText>
                                        )
                                    }
                                    <TextInputWithTitle onChangeText={(txt) => setFieldValue('description', txt)} title="Matter Description" isRequired={true} placeholder={'Enter description'} />
                                    {
                                        errors.description && touched.description && (
                                            <MyText style={{ color: 'red' }}>{errors.description}</MyText>
                                        )
                                    }
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenDate', true)}
                                        title="Open Date"
                                        isButton={true}
                                        buttonText={values.openDate ? values.openDate : 'Select Open date'}
                                    />
                                    <TextInputWithTitle
                                        title="Fee Earner Solicitor"
                                        isButton={true}
                                        buttonText={values.feeEarnerSolicitor || 'Select'}
                                        onPressButton={() => {
                                            setFieldValue('activeSolicitorType', 'feeEarner');
                                            setFieldValue('isOpenSolicitorModal', true);
                                        }}
                                    />

                                    <TextInputWithTitle
                                        title="Supervisor Solicitor"
                                        isButton={true}
                                        buttonText={values.supervisorSolicitor || 'Select'}
                                        onPressButton={() => {
                                            setFieldValue('activeSolicitorType', 'supervisor');
                                            setFieldValue('isOpenSolicitorModal', true);
                                        }}
                                    />
                                    <TextInputWithTitle
                                        title="Client reference number"
                                        placeholder={'Enter reference number'}
                                        onChangeText={(txt) => setFieldValue('clientRefNumber', txt)}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenMatterStatus', true)}
                                        title="Matter Status"
                                        isButton={true}
                                        buttonText={values.matterStatus ? values.matterStatus : 'Open '}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenMatterStage', true)}
                                        title="Matter Stage"
                                        isButton={true}
                                        buttonText={values.matterStage ? values.matterStage : 'New '}
                                    />
                                    <TextInputWithTitle
                                        title="Location"
                                        placeholder={'Enter location'}
                                        onChangeText={(txt) => setFieldValue('location', txt)}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenPracticeArea', true)}
                                        title="Practice Area"
                                        isButton={true}
                                        buttonText={values.practiceArea ? values.practiceArea : 'Find Practice Area '}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenTaskGroup', true)}
                                        title="Task Group"
                                        isButton={true}
                                        buttonText={values.taskGroup ? values.taskGroup : 'Select tasks group '}
                                    />

                                    {/* //Matter Permissions ===================> START*/}
                                    <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR }}>
                                        <MyText style={styles.title}>Matter Permissions</MyText>
                                        <View style={{ marginVertical: 10 }}>
                                            <MyText style={styles.label}>Firm users with access *</MyText>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 10 }}>
                                                {userWithAccess.map((item, index) => {
                                                    return (
                                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                                            <TouchableOpacity onPress={() => setFieldValue('userPermission', item.value)} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                                <View style={{ height: 15, width: 15, borderWidth: 1, borderColor: COLORS?.PRIMARY_COLOR_LIGHT, justifyContent: "center", alignItems: "center", borderRadius: 30 }} >
                                                                    <View style={{ height: 10, width: 10, backgroundColor: item.value == values.userPermission ? COLORS?.PRIMARY_COLOR_LIGHT : '#D0D9E0', justifyContent: "center", alignItems: "center", borderRadius: 30 }} />
                                                                </View>
                                                                <View >
                                                                    <MyText>{item.name}</MyText>
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                        {
                                            values.userPermission == "specific" &&
                                            <>
                                                <TextInputWithTitle
                                                    setFieldValue={setFieldValue}
                                                    arrayValue={values?.addUserItems}
                                                    onPressButton={() => setFieldValue('isOpenAddUserPermission', true)}
                                                    extraStyle={{ borderBottomWidth: 0, }}
                                                    title="Add users "
                                                    isRequired={true}
                                                    isButton={true}
                                                    buttonText={'Select User'}
                                                    customView={({ arrayValue, setFieldValue, onPressButton, buttonText }) => (
                                                        (
                                                            <View style={{ marginTop: 10 }}>
                                                                {arrayValue.map((item, index) => (
                                                                    console.log(item), "CUSTOM VIEWd =d==>",

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
                                                                                setFieldValue('addUserItems', updatedList);
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
                                                        )
                                                    )}
                                                />
                                                <TextInputWithTitle
                                                    setFieldValue={setFieldValue}
                                                    arrayValue={values?.matterNotificationItem}
                                                    onPressButton={() => setFieldValue('isOpenMatterNotificationUser', true)}
                                                    extraStyle={{ borderBottomWidth: 0, }}
                                                    title="Matter Notifications"
                                                    isButton={true}
                                                    buttonText={'Select User'}
                                                    customView={({ arrayValue, setFieldValue, onPressButton, buttonText }) => (
                                                        (
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
                                                                                setFieldValue('matterNotificationItem', updatedList);
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
                                                        )
                                                    )}
                                                />
                                                <MyText style={{ color: '#627585', marginBottom: 10, fontWeight: '300', fontSize: calculatefontSize(1.5) }}>Users you designated will be alerted to any status updates, matter deletions, or document uploads by client and associated contacts.</MyText>
                                            </>
                                        }
                                    </View>
                                    {/* //Matter Permissions ===================> END*/}

                                    {/* =============================Relatd Parties  */}
                                    <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                        <MyText style={styles.title}>Related Parties</MyText>
                                        {
                                            items?.map((item, index) => {
                                                return (
                                                    <>
                                                        <RelatedPartiesItems item={item} navigation={navigation} />

                                                    </>
                                                )
                                            })

                                        }
                                        <AddButton onPress={() => dispatch(addRelatedContact({
                                            pId: Math.floor(Math.random() * 1000),
                                        }))} title='Add related contact' />
                                    </View>
                                    {/* =============================Relatd Parties  END*/}

                                    {/* =============================Billign  */}
                                    <View style={{ borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                        <MyText style={styles.title}>Billing</MyText>
                                        <TouchableOpacity onPress={() => setFieldValue('isBillable', !values?.isBillable)} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 10 }}>
                                            <FontAwesome name={values?.isBillable ? "check-square" : "square-o"} size={20} color={COLORS?.PRIMARY_COLOR_LIGHT} />
                                            <MyText style={{ color: COLORS?.BLACK_COLOR, fontSize: calculatefontSize(1.9) }}>This matter is billable</MyText>
                                        </TouchableOpacity>

                                        <TextInputWithTitle
                                            onPressButton={() => { setFieldValue('isOpenBillingMethod', true) }}
                                            title="Billing method"
                                            isButton={true}
                                            buttonText={values.billingMethod ? values.billingMethod : 'Hourly'}
                                        />

                                    </View>
                                    {/* =============================Billign  END*/}


                                    {/* =============================Billing rates  */}
                                    <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                        <MyText style={styles.title}>{values?.billingMethod !== "Hourly" ? `Contingency fee defaults` : `Billing rates`}</MyText>
                                        {
                                            itemsForBilling?.map((item, index) => {
                                                return (
                                                    <>
                                                        <BillingRateItem item={item} navigation={navigation} />

                                                    </>
                                                )
                                            })

                                        }
                                        <AddButton onPress={() => { dispatch(addBillingRate({ pId: Math.floor(Math.random() * 1000) })) }} title={values?.billingMethod === "Hourly" ? 'Add Hourly fee' : 'Add Contingency fee'} />
                                    </View>
                                    {/* =============================Billing rates  END*/}

                                    {/* =============================Matter Budger  */}
                                    <View style={{ borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                        <MyText style={styles.title}>Matter budget</MyText>
                                        <TouchableOpacity onPress={() => setFieldValue('isMatterBudget', !values?.isMatterBudget)} style={{ flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 10 }}>
                                            <FontAwesome name={values?.isMatterBudget ? "check-square" : "square-o"} size={20} color={COLORS?.PRIMARY_COLOR_LIGHT} />
                                            <MyText style={{ color: COLORS?.BLACK_COLOR, fontSize: calculatefontSize(1.9) }}>Set a budget for this matter</MyText>
                                        </TouchableOpacity>
                                        {
                                            values?.isMatterBudget &&
                                            <>
                                                <TextInputWithTitle onChangeText={value => setFieldValue('budgetAmmount', value)} keyboardType='numeric' isRequired={true} title="Budget amount" placeholder={'0.00'} />
                                            </>
                                        }
                                    </View>
                                    {/* =============================Matter Budger  END*/}

                                    <TextInputWithTitle
                                        setFieldValue={setFieldValue}
                                        arrayValue={values?.selectReferalItems}
                                        onPressButton={() => setFieldValue('isOpenSelectReferal', true)}
                                        title="Select Referral"
                                        isButton={true}
                                        buttonText={'Select '}
                                        customView={({ arrayValue, setFieldValue, onPressButton, buttonText }) => (

                                            <View style={{ marginTop: 10 }}>
                                                {arrayValue.map((item, index) => (
                                                    <View
                                                        key={item.referralId}
                                                        style={styles.itemContainer}
                                                    >
                                                        <MyText>
                                                            {`${item?.firstName} ${item?.lastName}`}

                                                        </MyText>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                const updatedList = arrayValue.filter(
                                                                    (c) => c.referralId !== item.referralId
                                                                );
                                                                setFieldValue('selectReferalItems', updatedList);
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
                                    <View style={{ height: 20 }} />
                                </ScrollView>
                                {/* //////////////////////////////////////////////=============================================== MODALS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\========> */}
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenClient', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                const alreadyExists = values.clientItems.find(
                                                    (i) => i.clientId === item.clientId
                                                );
                                                if (!alreadyExists) {
                                                    setFieldValue('clientItems', [...values.clientItems, item]);
                                                }
                                                else {
                                                    Alert.alert('Client already added');
                                                }
                                                setFieldValue('clientObj', item);
                                                setFieldValue('client', item?.clientEmailAddressDTOList?.[0]?.email || '');
                                                setFieldValue('isOpenClient', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.type === 'Individual'
                                                    ? `${item?.firstName} ${item?.lastName} (${item?.clientEmailAddressDTOList?.[0]?.email || ''})`
                                                    : `${item?.companyName} ${item?.companyNumber}`}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenClient}
                                    data={clientData}
                                    searchKey="firstName"
                                />
                                <BottomModalListWithSearch
                                    onClose={() => {
                                        setFieldValue('isOpenSolicitorModal', false);
                                        setFieldValue('activeSolicitorType', '');
                                    }}
                                    visible={values.isOpenSolicitorModal}
                                    data={billingData}
                                    searchKey="email"
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (values.activeSolicitorType === 'feeEarner') {
                                                    setFieldValue('feeEarnerSolicitorObj', item);
                                                    setFieldValue('feeEarnerSolicitor', item?.userProfileDTO?.fullName);
                                                } else {
                                                    setFieldValue('supervisorSolicitorObj', item);
                                                    setFieldValue('supervisorSolicitor', item?.userProfileDTO?.fullName);
                                                }
                                                setFieldValue('isOpenSolicitorModal', false);
                                                setFieldValue('activeSolicitorType', '');
                                            }}
                                            style={{
                                                borderBottomWidth: 1,
                                                paddingVertical: 10,
                                                borderColor: COLORS?.BORDER_LIGHT_COLOR
                                            }}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.userProfileDTO?.fullName}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                />
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenMatterStatus', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('matterStatusObj', item);
                                                setFieldValue('matterStatus', item?.name);
                                                setFieldValue('isOpenMatterStatus', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenMatterStatus}
                                    data={matterStatus}
                                    searchKey="name"
                                />
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenMatterStage', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('matterStageObj', item);
                                                setFieldValue('matterStage', item?.name);
                                                setFieldValue('isOpenMatterStage', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenMatterStage}
                                    data={matterStage}
                                    searchKey="name"
                                />
                                {/* ==>PRACTICE AREA  */}
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenPracticeArea', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setPracticeAreaId(item?.practiceAreaId);
                                                setFieldValue('practiceArea', item?.name);
                                                setFieldValue('practiceAreaObj', item);
                                                setFieldValue('isOpenPracticeArea', false)
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenPracticeArea}
                                    data={practiceAreaData}
                                    searchKey="name"
                                />
                                {/* ==>Task  */}
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenTaskGroup', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('taskGroup', item?.name);
                                                setFieldValue('taskGroupObj', item);
                                                setFieldValue('isOpenTaskGroup', false)
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenTaskGroup}
                                    data={taskGroupData}
                                    searchKey="name"
                                />

                                {/* ---------------------------------------------------------------------------> */}

                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenAddUserPermission', false)}
                                    renderItem={({ item }) => (
                                        console.log(item, "dfdljhfkj===>"),

                                        <TouchableOpacity
                                            onPress={() => {
                                                const alreadyExists = values.addUserItems.find(
                                                    (i) => i.userId === item.userId
                                                );
                                                if (!alreadyExists) {
                                                    setFieldValue('addUserItems', [...values.addUserItems, item]);
                                                }
                                                else {
                                                    Alert.alert('Client already added');
                                                }
                                                setFieldValue('addUserPermissionObj', item);
                                                setFieldValue('addUserPermission', item?.userProfileDTO?.fullName || '');
                                                setFieldValue('isOpenAddUserPermission', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.userProfileDTO?.fullName}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenAddUserPermission}
                                    data={billingData}
                                    searchKey="email"
                                />

                                {/* //Matter notification ===> */}

                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenMatterNotificationUser', false)}
                                    renderItem={({ item }) => (
                                        console.log(item, "dfdljhfkj===>"),

                                        <TouchableOpacity
                                            onPress={() => {
                                                const alreadyExists = values.matterNotificationItem.find(
                                                    (i) => i.userId === item.userId
                                                );
                                                if (!alreadyExists) {
                                                    setFieldValue('matterNotificationItem', [...values.matterNotificationItem, item]);
                                                }
                                                else {
                                                    Alert.alert('Client already added');
                                                }
                                                setFieldValue('matterNotificationUserObj', item);
                                                setFieldValue('matterNotificationUser', item?.userProfileDTO?.fullName || '');
                                                setFieldValue('isOpenMatterNotificationUser', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.userProfileDTO?.fullName}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenMatterNotificationUser}
                                    data={billingData}
                                    searchKey="email"
                                />

                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenBillingMethod', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('billingMethodObj', item);
                                                setFieldValue('billingMethodValue', item?.value);
                                                setFieldValue('billingMethod', item?.name);
                                                setFieldValue('isOpenBillingMethod', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenBillingMethod}
                                    data={billingMethod}
                                    searchKey="name"
                                />


                                {/* //REFERAL DATA=====> */}
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenSelectReferal', false)}
                                    renderItem={({ item }) => (
                                        console.log(item, "dfdljhfkj===>"),

                                        <TouchableOpacity
                                            onPress={() => {
                                                const alreadyExists = values.selectReferalItems.find(
                                                    (i) => i.referralId === item.referralId
                                                );
                                                if (!alreadyExists) {
                                                    setFieldValue('selectReferalItems', [...values.selectReferalItems, item]);
                                                }
                                                else {
                                                    Alert.alert('Client already added');
                                                }
                                                setFieldValue('selectReferalObj', item);
                                                setFieldValue('selectReferal', `${item?.firstName} ${item?.lastName}` || '');
                                                setFieldValue('isOpenSelectReferal', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {`${item?.firstName} ${item?.lastName}`}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenSelectReferal}
                                    data={referalData}
                                    searchKey="firstName"
                                />
                                {/* //////////////////////////////////////////////=============================================== MODALS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\========> */}
                                <DatePicker
                                    modal
                                    mode='date'
                                    open={values.isOpenDate}
                                    date={new Date()}
                                    onConfirm={date => {
                                        setFieldValue('selectedDate', date?.toISOString())
                                        setFieldValue('isOpenDate', false);
                                        setFieldValue(
                                            'openDate',
                                            moment(date).format('MM/DD/YYYY'),
                                        );
                                    }}
                                    onCancel={() => {
                                        setFieldValue('isOpenDate', false);
                                    }}
                                />
                            </KeyboardAvoidingView>
                        </Wrapper>
                    </>

                )}
            </Formik>

        </>
    )
}


export default CreateMatter

const styles = StyleSheet.create({
    title: {
        fontSize: calculatefontSize(2),
        // fontFamily:fontFamily.Bold,
        fontWeight: "bold",
        color: COLORS.BLACK_COLOR,
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