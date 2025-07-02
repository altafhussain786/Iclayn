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
import { addRelatedContact } from '../../../../store/slices/matterSlice/createItemforRelateParties'
// import RelatedPartiesItems from '../components/RelatedPartiesItems'
// import BillingRateItem from '../components/BillingRateItem'
import { addBillingRate } from '../../../../store/slices/matterSlice/createItemForBillingRate'
import httpRequest from '../../../../api/apiHandler'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import DatePicker from 'react-native-date-picker';
import { useToast } from 'react-native-toast-notifications'




const CreateTask = ({ navigation }) => {
    const dispatch = useDispatch()
    const toast = useToast();
    const items = useSelector(state => state.createItemforRelateParties.items);

    //CLients state===============
    const [billingData, setBillingData] = React.useState([]);
    const [matterData, setmatterData] = React.useState([]);


    const userDetails = useSelector(state => state?.userDetails?.userDetails);

    // console.log(userDetails, "USER DETAILS=======>");


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
        getMatterData();
        getBillingData();
    }, [])


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
    const taskType = [
        {
            id: 1,
            name: 'Normal',
            value: 'normal'
        },
        {
            id: 2,
            name: 'Urgent',
            value: 'urgent'
        },
        {
            id: 3,
            name: 'Commercial',
            value: 'commercial'
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
                        name: '',
                        //priority status
                        priorityStatus: '',
                        priorityStatusObj: {},
                        isOpenpriorityStatus: false,
                        description: '',
                        // matterselect 
                        matterSelected: '',
                        matterSelectedObj: {},
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
                        selectedDate: moment().format('MM/DD/YYYY'),
                        isdueDate: false,
                        //loader
                        loader: false
                    }
                }
                validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    console.log(values, "========================================== selectReferalItems");
                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="New Task" />
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
                                    <TextInputWithTitle onChangeText={(txt) => setFieldValue('description', txt)} title="Matter Description" isRequired={true} placeholder={'Enter description'} />
                                    {
                                        errors.description && touched.description && (
                                            <MyText style={{ color: 'red' }}>{errors.description}</MyText>
                                        )
                                    }

                                    <TextInputWithTitle
                                        title="Matter"
                                        isButton={true}
                                        buttonText={values.matterSelected || 'Select Matter'}
                                        onPressButton={() => setFieldValue('isOpenMatterSelected', true)}
                                    />
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
                                        isButton={true}
                                        buttonText={values.feeEarnerSolicitor || 'Select Assign to'}
                                        onPressButton={() => {
                                            setFieldValue('activeSolicitorType', 'feeEarner');
                                            setFieldValue('isOpenSolicitorModal', true);
                                        }}
                                    />

                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpentaskType', true)}
                                        title="Task Type"
                                        isButton={true}
                                        buttonText={values.taskType ? values.taskType : 'Find a task type '}
                                    />

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
                                                        <MyText>Hello</MyText>
                                                        {/* <RelatedPartiesItems item={item} navigation={navigation} /> */}

                                                    </>
                                                )
                                            })

                                        }
                                        <AddButton onPress={() => dispatch(addRelatedContact({
                                            pId: Math.floor(Math.random() * 1000),
                                        }))} title='Add a reminder' />
                                    </View>
                                    {/* =============================Relatd Parties  END*/}

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
                                    data={taskType}
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