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



const CreateBilling = ({ navigation }) => {
    const dispatch = useDispatch()
    const toast = useToast();
    const [firmUserData, setFirmUserData] = useState([])
    const items = useSelector(state => state.createItemforReminder.items);

    const [matterData, setmatterData] = React.useState([]);
    const [eventTypeData, seteventTypeData] = React.useState([]);
    const [billingData, setBillingData] = React.useState([]);


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



    //get users 

    useEffect(() => {

        getMatterData()

    }, [])


    console.log(billingData);


    const validationSchema = Yup.object().shape({
        title: Yup.string().required('title is required'),
    })
    return (
        <>

            <Formik
                initialValues={
                    {

                        // matterselect 
                        matterSelected: '',
                        matterSelectedObj: {},
                        isOpenMatterSelected: false,

                        //start data/time
                        isOpeninvDate: false,
                        invDate: '',
                        selectedinvDate: new Date(), // 👈 must be a Date object

                        //end date/time
                        isOpendueDate: false,
                        dueDate: '',
                        selecteddueDate: new Date(),


                        //description
                        description: '',


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
                                    <TextInputWithTitle title='Description' value={values.description} onChangeText={(txt) => setFieldValue('description', txt)} placeholder={'Description'} />

                                    <TextInputWithTitle
                                        title="Invoice Date "
                                        isButton={true}
                                        isRequired={true}
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