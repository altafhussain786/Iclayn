import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
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
import httpRequest from '../../../../api/apiHandler'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import DatePicker from 'react-native-date-picker';
import { useToast } from 'react-native-toast-notifications'
import ReminderItems from '../components/ReminderItems'
import { addReminderItem, resetReminderItems } from '../../../../store/slices/taskSlice/createItemforReminder'
import { removeDocument } from '../../../../store/slices/taskSlice/createItemforDocuments'




const CreateTask = ({ navigation, route }) => {
    const matterDetails = route?.params?.matterDetails
    const dispatch = useDispatch()
    const toast = useToast();
    const items = useSelector(state => state.createItemforReminder.items);
    const itemsDocuments = useSelector(state => state.createItemforDocuments.document);



    //CLients state===============
    const [billingData, setBillingData] = React.useState([]);
    const [matterData, setmatterData] = React.useState([]);
    const [tasktypeData, setTasktypeData] = React.useState([]);
    const userDetails = useSelector(state => state?.userDetails?.userDetails);

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
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }
    const getTaskTypeData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/task-type/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setTasktypeData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");

        }
    }


    const getBillingData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/user/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setBillingData(res?.data);
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    const getTimeEstimateArray = (unit) => {
        console.log(unit, "===>");

        let max = 0;
        if (unit === 'Minutes') {
            max = 60;
        } else if (unit === 'Hours') {
            max = 24;
        } else if (unit === 'Days') {
            max = 365;
        }

        return Array.from({ length: max }, (_, i) => ({
            name: `${i + 1} ${unit}`,
            value: i + 1,
        }));
    };

    useEffect(() => {
        getTaskTypeData()
        getMatterData();
        getBillingData();
    }, [])

    const timeEstimateData = [
        {
            id: 1,
            name: 'Hours',
            value: 'hours'
        },
        {
            id: 2,
            name: 'Minutes',
            value: 'minutes'
        },
        {
            id: 3,
            name: 'Days',
            value: 'days'
        },
    ]

    const priorityStatus = [
        {
            id: 1,
            name: 'Low',
            value: 'low'
        },
        {
            id: 2,
            name: 'Normal',
            value: 'normal'
        },
        {
            id: 3,
            name: 'High',
            value: 'high'
        },
    ]
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('name is required'),
        matterSelected: Yup.string().required('Matter is required'),
        feeEarnerSolicitor: Yup.string().required('Assign to is required'),

    })

    console.log(matterDetails, "matterDetails=========d===>", matterData);

    return (
        <>

            <Formik
                initialValues={
                    {
                        name: '',
                        //priority status
                        priorityStatus: '',
                        priorityStatusObj: {},
                        isOpenpriorityStatus: false,
                        description: '',
                        // matterselect 
                        matterSelected: matterDetails?.name || '',
                        matterSelectedObj: matterDetails || {},
                        isOpenMatterSelected: false,
                        //isPrivateTask
                        isPrivateTask: false,
                        //Assign to
                        activeSolicitorType: '',
                        isOpenSolicitorModal: false,
                        feeEarnerSolicitor: '',
                        feeEarnerSolicitorObj: {},
                        supervisorSolicitor: '',
                        supervisorSolicitorObj: {},
                        //Task type
                        taskType: '',
                        taskTypeObj: {},
                        isOpentaskType: false,
                        // DUE DATE ==>
                        dueDate: moment().format('DD/MM/YYYY'),
                        selectedDate: moment().toISOString(),
                        isdueDate: false,

                        //timeEstimatetype
                        timeEstimateType: '',
                        isOpenTimeEstimateType: false,
                        timeEstimateTypeObj: {},

                        //time estimateNumber
                        timeEstimateNumber: "",
                        timeEstimateValue: "",
                        timeEstimateNumberObj: {},
                        isTimeEstimateNumberOpen: false,

                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    const mappedDataForTask = items?.map(data => {
                        return {
                            createdOn: "",
                            updatedOn: null,
                            createdBy: null,
                            updatedBy: null,
                            revision: null,
                            type: data?.reminderThrough,
                            remTime: data?.counts,
                            timeType: data?.reminderType,
                            mtReminderId: null
                        }
                    })
                    const paylod = {
                        createdOn: "",
                        updatedOn: null,
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        taskId: null,
                        name: values?.name,
                        cod: null,
                        priority: values?.priorityStatus,
                        description: values?.description,
                        assignTo: values?.feeEarnerSolicitorObj?.userId,
                        taskPrivate: values.isPrivateTask,
                        typeId: values?.taskTypeObj?.taskTypeId,
                        status: "Pending",
                        document: itemsDocuments?.templateId ? String(itemsDocuments?.templateId) : null,
                        documentName: itemsDocuments?.name || null,
                        timeEstimate: values.timeEstimateValue,
                        timeEstimateType: values.timeEstimateType,
                        dueDateEnable: true,
                        dueDate: values.selectedDate,
                        dueTime: null,
                        dueTimeType: "",
                        afterBefore: "",
                        matterId: values?.matterSelectedObj?.matterId,
                        matterTaskReminderDTOList: mappedDataForTask,
                        matterTimeEntryDTO: null
                    }
                    console.log(paylod, "========================================== selectReferalItems");
                    setFieldValue('loader', true)
                    const { res, err } = await httpRequest({
                        method: `post`,
                        path: `/ic/matter/task/`,
                        params: paylod,
                        navigation: navigation
                    })
                    if (res) {
                        toast.show('Task created successfully', { type: 'success' })
                        setFieldValue('loader', false)
                        dispatch(resetReminderItems());
                        dispatch(removeDocument());
                        navigation.goBack()
                    }
                    else {
                        setFieldValue('loader', false)

                        toast.show('Something went wrong', { type: 'danger' })
                    }

                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => {
                            {
                                dispatch(resetReminderItems());
                                dispatch(removeDocument());
                                navigation.goBack()
                            }
                        }} isShowTitle={true} title="New Task" />
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

                                    <TextInputWithTitle onChangeText={(txt) => setFieldValue('name', txt)} placeholder={'Name'} isRequired={true} />
                                    {
                                        errors.name && touched.name && (
                                            <MyText style={{ color: 'red' }}>{errors.name}</MyText>
                                        )
                                    }

                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenpriorityStatus', true)}
                                        title="Priority Status"
                                        isButton={true}
                                        buttonText={values.priorityStatus ? values.priorityStatus : 'Normal '}
                                    />
                                    <TextInputWithTitle onChangeText={(txt) => setFieldValue('description', txt)} title="Description" placeholder={'Enter description'} />


                                    <TextInputWithTitle
                                        editable={matterDetails?.matterId ? false : true}
                                        title="Matter"
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.matterSelected || 'Select Matter'}
                                        onPressButton={() => {
                                            if (matterDetails?.matterId) {
                                                setFieldValue('isOpenMatterSelected', false)
                                            }
                                            else {
                                                setFieldValue('isOpenMatterSelected', true)
                                            }
                                            // setFieldValue('isOpenMatterSelected', true)
                                        }}
                                    />
                                    {
                                        errors.matterSelected && touched.matterSelected && (
                                            <MyText style={{ color: 'red' }}>{errors.matterSelected}</MyText>
                                        )
                                    }
                                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>

                                        <MyText style={styles.title}>Is Private Task</MyText>
                                        <Switch
                                            value={values.isPrivateTask}
                                            onValueChange={(val) => setFieldValue('isPrivateTask', val)}
                                            thumbColor={values.isPrivateTask ? "#ffffff" : "#ffffff"}
                                            trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                                        />
                                    </View>
                                    <TextInputWithTitle
                                        title="Assign to"
                                        isRequired={true}
                                        isButton={true}
                                        buttonText={values.feeEarnerSolicitor || 'Select Assign to'}
                                        onPressButton={() => {
                                            setFieldValue('activeSolicitorType', 'feeEarner');
                                            setFieldValue('isOpenSolicitorModal', true);
                                        }}
                                    />
                                    {
                                        errors.feeEarnerSolicitor && touched.feeEarnerSolicitor && (
                                            <MyText style={{ color: 'red' }}>{errors.feeEarnerSolicitor}</MyText>
                                        )
                                    }
                                    <TextInputWithTitle
                                        title="Task type"
                                        isButton={true}
                                        buttonText={values.taskType || 'Find a task type'}
                                        onPressButton={() => setFieldValue('isOpentaskType', true)}
                                    />

                                    <TextInputWithTitle
                                        onPressButton={() => navigation.navigate('TaskDocuments', { indexValue: 0 })}
                                        title="Document"
                                        isButton={true}
                                        buttonText={Object.keys(itemsDocuments || {}).length > 0 ? itemsDocuments?.name : 'Select Document'}
                                    />

                                    <TextInputWithTitle
                                        title="Select Estimate Type"
                                        isButton={true}
                                        buttonText={values.timeEstimateType || '1 Hours'}
                                        onPressButton={() => setFieldValue('isOpenTimeEstimateType', true)}
                                    />
                                    <TextInputWithTitle
                                        title="Time Estimate Number"
                                        isButton={true}
                                        buttonText={values.timeEstimateNumber || 1}
                                        onPressButton={() => setFieldValue('isTimeEstimateNumberOpen', true)}
                                    />
                                    {/* <TextInputWithTitle
                                        title="Matter"
                                        isButton={true}
                                        isRequired={true}
                                        buttonText={values.matterSelected || 'Select Matter'}
                                        onPressButton={() => setFieldValue('isOpenMatterSelected', true)}
                                    /> */}


                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isdueDate', true)}
                                        title="Due Date"
                                        isButton={true}
                                        buttonText={values.dueDate ? values.dueDate : 'Select Open date'}
                                    />


                                    {/* =============================Relatd Parties  */}
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
                                        }))} title='Add a reminder' />
                                    </View>

                                    <View style={{ height: 20 }} />
                                </ScrollView>
                                {/* //////////////////////////////////////////////=============================================== MODALS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\========> */}
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
                                    onClose={() => setFieldValue('isOpenpriorityStatus', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('priorityStatusObj', item);
                                                setFieldValue('priorityStatus', item?.name);
                                                setFieldValue('isOpenpriorityStatus', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenpriorityStatus}
                                    data={priorityStatus}
                                    searchKey="name"
                                />

                                {/* ==>PRACTICE AREA  */}
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


                                {/* ---------------------------------------------------------------------------> */}

                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpentaskType', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('taskTypeObj', item);
                                                setFieldValue('taskType', item?.name);
                                                setFieldValue('isOpentaskType', false);
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpentaskType}
                                    data={tasktypeData}
                                    searchKey="name"
                                />
                                {/* //////////////////////////////////////////////=============================================== MODALS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\========> */}
                                <DatePicker
                                    modal
                                    mode='date'
                                    open={values.isdueDate}
                                    date={new Date()}
                                    onConfirm={date => {
                                        setFieldValue('selectedDate', date?.toISOString())
                                        setFieldValue('isdueDate', false);
                                        setFieldValue(
                                            'dueDate',
                                            moment(date).format('MM/DD/YYYY'),
                                        );
                                    }}
                                    onCancel={() => {
                                        setFieldValue('isdueDate', false);
                                    }}
                                />
                                {/* ==>TIME ESTIMATE  */}
                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isOpenTimeEstimateType', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('timeEstimateType', item?.name);
                                                setFieldValue('timeEstimateTypeObj', item);
                                                setFieldValue('isOpenTimeEstimateType', false)
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isOpenTimeEstimateType}
                                    data={timeEstimateData}
                                    searchKey="name"
                                />

                                {/* Time EStimate Number ===============> */}

                                <BottomModalListWithSearch
                                    onClose={() => setFieldValue('isTimeEstimateNumberOpen', false)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setFieldValue('timeEstimateNumber', item?.name);
                                                setFieldValue('timeEstimateValue', item?.value);
                                                setFieldValue('timeEstimateNumberObj', item);
                                                setFieldValue('isTimeEstimateNumberOpen', false)
                                            }}
                                            style={styles.itemStyle}
                                        >
                                            <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                                {item?.name}
                                            </MyText>
                                        </TouchableOpacity>
                                    )}
                                    visible={values?.isTimeEstimateNumberOpen}
                                    data={getTimeEstimateArray(values.timeEstimateType || 'Hours')}
                                    searchKey="name"
                                />

                            </KeyboardAvoidingView>
                        </Wrapper>
                    </>

                )}
            </Formik>

        </>
    )
}


export default CreateTask

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