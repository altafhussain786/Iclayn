import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

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



const CreateMatter = ({ navigation }) => {
    const dispatch=useDispatch()
    const items = useSelector(state => state.createItemforRelateParties.items);
    const itemsForBilling = useSelector(state => state.createItemForBillingRate.items);
    console.log(items, "items");
    

    const userWithAccess = [
        {
            id: 1,
            name: 'Everyone',
            value: 'everyone'
        },
        {
            id: 2,
            name: 'Specificusers',
            value: 'specificusers'
        },

    ]
    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
    })
    return (
        <>
            <ScreenHeader extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="New Matter" />

            <Formik
                initialValues={
                    {

                        //Client obj
                        client: '',
                        clientObj: {},
                        isOpenClient: false,
                        //end

                        title: '',
                        description: '',
                        openDate: moment().format('DD/MM/YYYY'),

                        //Supervisor Solicitor
                        supervisorSolicitor: '',
                        supervisorSolicitorObj: {},
                        isOpenSupervisorSolicitor: false,

                        //Fee Earner Solicitor
                        feeEarnerSolicitor: '',
                        feeEarnerSolicitorObj: {},
                        isOpenFeeEarnerSolicitor: false,

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
                        addUserPermissionObj: {},
                        isOpenAddUserPermission: false,

                        //Matter Notification
                        matterNotificationUser: '',
                        matterNotificationUserObj: {},
                        isOpenMatterNotificationUser: false,

                        //Bill
                        isBillable: false,

                        //Billing Method
                        billingMethod: '',
                        billingMethodObj: {},
                        isOpenBillingMethod: false,

                        //Matter budger
                        isMatterBudget: false,
                        budgetAmmount: "",

                        //Select Referal
                        selectReferal: '',
                        selectReferalObj: {},
                        isOpenSelectReferal: false,



                    }
                }
                validationSchema={validationSchema}
                onSubmit={values => console.log(values)}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <>
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
                                    <TextInputWithTitle isRequired={true} title="Client" isButton={true} buttonText={'Select Client'} />
                                    <TextInputWithTitle placeholder={'Matter title'} isRequired={true} />
                                    <TextInputWithTitle title="Matter Description" isRequired={true} placeholder={'Enter description'} />
                                    <TextInputWithTitle
                                        title="Open Date"
                                        isButton={true}
                                        buttonText={values.openDate ? values.openDate : 'Select Open date'}
                                    />
                                    <TextInputWithTitle
                                        title="Supervisor Solicitor"
                                        isButton={true}
                                        buttonText={values.supervisorSolicitor ? values.supervisorSolicitor : 'Select '}
                                    />
                                    <TextInputWithTitle
                                        title="Fee Earner Solicitor"
                                        isButton={true}
                                        buttonText={values.feeEarnerSolicitor ? values.supervisorSolicitor : 'Select '}
                                    />
                                    <TextInputWithTitle
                                        title="Client reference number"
                                        placeholder={'Enter reference number'}
                                        onChangeText={(txt) => setFieldValue('clientRefNumber', txt)}
                                    />
                                    <TextInputWithTitle
                                        title="Matter Status"
                                        isButton={true}
                                        buttonText={values.matterStatus ? values.matterStatus : 'Open '}
                                    />
                                    <TextInputWithTitle
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
                                        title="Practice Area"
                                        isButton={true}
                                        buttonText={values.practiceArea ? values.practiceArea : 'Find Practice Area '}
                                    />
                                    <TextInputWithTitle
                                        title="Task Group"
                                        isButton={true}
                                        buttonText={values.practiceArea ? values.practiceArea : 'Select tasks group '}
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
                                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                                                <View style={{ height: 15, width: 15, borderWidth: 1, borderColor: COLORS?.PRIMARY_COLOR_LIGHT, justifyContent: "center", alignItems: "center", borderRadius: 30 }} >
                                                                    <View style={{ height: 10, width: 10, backgroundColor: item.value == values.userPermission ? COLORS?.PRIMARY_COLOR_LIGHT : '#D0D9E0', justifyContent: "center", alignItems: "center", borderRadius: 30 }} />
                                                                </View>
                                                                <TouchableOpacity onPress={() => setFieldValue('userPermission', item.value)}>
                                                                    <MyText>{item.name}</MyText>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    )
                                                })}
                                            </View>
                                        </View>
                                        {
                                            values.userPermission == "specificusers" &&
                                            <>
                                                <TextInputWithTitle
                                                    extraStyle={{ borderBottomWidth: 0, }}
                                                    title="Add users "
                                                    isRequired={true}
                                                    isButton={true}
                                                    buttonText={values.addUserPermission ? values.addUserPermission : 'Select User'}
                                                />
                                                <TextInputWithTitle
                                                    extraStyle={{ borderBottomWidth: 0, }}
                                                    title="Matter Notifications"
                                                    isButton={true}
                                                    buttonText={values.matterNotificationUser ? values.matterNotificationUser : 'Select User'}
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
                                                      <RelatedPartiesItems item={item} navigation={navigation}/>

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
                                            title="Billing method"
                                            isButton={true}
                                            buttonText={values.billingMethod ? values.billingMethod : 'Hourly'}
                                        />

                                    </View>
                                    {/* =============================Billign  END*/}


                                    {/* =============================Billing rates  */}
                                    <View style={{ borderBottomWidth: 1, borderColor: COLORS?.LIGHT_COLOR, marginVertical: 10, }}>
                                        <MyText style={styles.title}>Billing rates</MyText>
                                         {
                                            itemsForBilling?.map((item, index) => {
                                                return (
                                                    <>
                                                      <BillingRateItem item={item} navigation={navigation}/>

                                                    </>
                                                )
                                            })

                                        }
                                        <AddButton onPress={()=>{dispatch(addBillingRate({pId:Math.floor(Math.random() * 1000)}))}} title='Add Hourly fee' />
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
                                                <TextInputWithTitle keyboardType='numeric' isRequired={true} title="Budget amount" placeholder={'0.00'} />
                                            </>
                                        }   
                                    </View>
                                    {/* =============================Matter Budger  END*/}

                                    <TextInputWithTitle
                                        title="Select Referral"
                                        isButton={true}
                                        buttonText={values.selectReferal ? values.selectReferal : 'Select '}
                                    />
                                    <View style={{ height: 20 }} />
                                </ScrollView>
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
})