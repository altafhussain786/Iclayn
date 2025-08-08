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
import { API_URL, COLORS, prefixList } from '../../../../constants'
import ScreenHeader from '../../../../components/ScreenHeader'
import TextInputWithTitle from '../../../../components/TextInputWithTitle'
import Wrapper from '../../../../components/Wrapper'
import MyText from '../../../../components/MyText'
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch'
import httpRequest from '../../../../api/apiHandler'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'





const CreateInternalLogs = ({ navigation }) => {
    const dispatch = useDispatch();
    const items = useSelector(state => state.createItemForAddEmail.items);
    const userDetails = useSelector(state => state?.userDetails?.userDetails);


    const [matterData, setmatterData] = useState([]);
    const [categoryData, setcategoryData] = useState([]);
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
    const getCategoryData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/doc-category/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setcategoryData(res?.data);
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
        getCategoryData();
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
    const formatWithOffset = (date) => {
        const pad = n => String(n).padStart(2, '0');
        const yyyy = date.getFullYear();
        const MM = pad(date.getMonth() + 1);
        const dd = pad(date.getDate());
        const hh = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}.000+05:00`;
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
                        matter: "",
                        matterObj: {},
                        isOpenMatter: false,
                        // ============>

                        category: "",
                        categoryObj: {},
                        isOpenCategory: false,

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

                        //Document
                        documentFile: [],

                        //loader
                        loader: false
                    }
                }
                // validationSchema={validationSchema}
                onSubmit={async (values, { setFieldValue }) => {
                    const token = await AsyncStorage.getItem('access_token')
                    // console.log(token, "values=======================>");
                    const formData = new FormData();
                    const payload = {
                        createdOn: `2025-08-08T16:12:00+05:00`,
                        updatedOn: `2025-08-08T16:12:00+05:00`,
                        // createdOn: formatWithOffset(new Date()),
                        // updatedOn: formatWithOffset(new Date()),
                        createdBy: userDetails?.userId,
                        updatedBy: null,
                        revision: null,
                        matterComLogId: null,
                        // logDate: values?.selecteddate,
                        // logTime: values?.selectedtime,
                        logDate: "2025-08-08T14:11:21+05:00",
                        logTime: "2025-08-08T14:11:21+05:00",
                        fromId: values?.fromObj?.userId,
                        toId: values?.toObj?.clientId,
                        subject: values?.subject,
                        body: values?.body,
                        timer: null,
                        matterId: values?.matterObj?.matterId,
                        type: "Internal", // or "Phone", based on use case
                        attachmentDTOList: null,
                        status: "Active",
                        categoryId: 2
                    };

                    formData.append('data', {
                        string: JSON.stringify(payload), // RN ke kuch builds 'string' key chahte
                        type: 'application/json',
                        name: 'data.json',
                    });
                    if (values?.documentFile?.length > 0) {

                        formData.append('doc', {
                            uri: values?.documentFile[0].uri, // local file uri
                            type: values?.documentFile[0].type, // e.g., image/jpeg
                            name: values?.documentFile[0].name,
                        });
                    }
                    setFieldValue('loader', true);
                    try {
                        const response = await fetch(`${API_URL}/ic/matter/inter-log/v1`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                // 'Content-Type': 'multipart/form-data',
                            },
                            body: formData,
                        });

                        const result = await response.json();
                        setFieldValue('loader', false);

                        console.log('Upload Success:', result);
                    } catch (error) {
                        setFieldValue('loader', false);

                        console.error('Upload Error:', error);
                    }
                    setFieldValue('loader', false);



                }}
            >

                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

                    <>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Internal logs" />

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
                                        onPressButton={() => setFieldValue('isOpenMatter', true)}
                                        title="Matter "
                                        isRequired={true}
                                        isButton={true}
                                        buttonText={values.matter ? values.matter : 'Select Matter'}
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
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isdateOpen', true)}
                                        title="Received date"
                                        isButton={true}
                                        buttonText={values.date ? values.date : 'DD/MM/YYYY'}
                                    />
                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isTimeOpen', true)}
                                        title="Time"
                                        isButton={true}
                                        buttonText={values.time ? values.time : 'hh:mm A'}
                                    />

                                    <View style={{ gap: 10, marginVertical: 10, padding: 15, backgroundColor: COLORS?.BORDER_LIGHT_COLOR }}>
                                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                                            <TouchableOpacity
                                                onPress={async () => {
                                                    try {
                                                        const [pickResult] = await pick();
                                                        console.log(pickResult, "PICK RESULT");

                                                        if (pickResult) {
                                                            if (values?.documentFile?.find(doc => doc?.name === pickResult?.name)) {
                                                                Alert.alert('Alert', 'This file is already uploaded');
                                                                return
                                                            }
                                                            if (values?.documentFile?.length >= 5) {
                                                                Alert.alert('Alert', 'You can upload a maximum of 5 files');
                                                                return
                                                            }
                                                            else if (pickResult?.size > 5242880) {
                                                                Alert.alert('Alert', 'You can upload a maximum of 5MB each');
                                                                return
                                                            }
                                                            else {
                                                                setFieldValue('documentFile', [...(values?.documentFile || []), pickResult]);

                                                            }

                                                        }
                                                    } catch (err) {
                                                        console.log(err);
                                                    }
                                                }}
                                                style={{
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
                                                    gap: 10,
                                                    borderStyle: "dashed",
                                                    borderWidth: 1,
                                                    padding: 10,
                                                    borderRadius: 5,
                                                }}
                                            >
                                                <AntDesign name="upload" size={15} color={COLORS?.BLACK_COLOR} />
                                                <MyText>Upload File</MyText>
                                            </TouchableOpacity>

                                            <MyText style={{ flex: 1, fontSize: calculatefontSize(1.4) }}>
                                                You can upload a maximum of 5 files, 5MB each
                                            </MyText>
                                        </View>

                                        {/* Uploaded Files List */}
                                        {values?.documentFile?.length > 0 && (
                                            <View style={{ gap: 10, }}>
                                                {values?.documentFile?.map((d, i) => (
                                                    <View
                                                        key={i}
                                                        style={{
                                                            flexDirection: "row",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            padding: 10,
                                                            backgroundColor: '#fffcfcff',
                                                            borderRadius: 5,
                                                        }}
                                                    >
                                                        <MyText style={{ width: "70%" }}>{d?.name || 'Unnamed File'}</MyText>
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                setFieldValue(
                                                                    'documentFile',
                                                                    values?.documentFile?.filter((_, index) => index !== i)
                                                                )
                                                            }
                                                        >
                                                            <Entypo name="circle-with-cross" size={20} color="red" />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>

                                    <TextInputWithTitle
                                        onPressButton={() => setFieldValue('isOpenCategory', true)}
                                        title="Category"
                                        isButton={true}
                                        buttonText={values.category ? values.category : 'Find a document Category'}
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
                                        onClose={() => setFieldValue('isOpenCategory', false)}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setFieldValue('categoryObj', item);
                                                    setFieldValue('category', item?.name);
                                                    setFieldValue('isOpenCategory', false);
                                                }}
                                                style={styles.itemStyle}
                                            >
                                                <MyText style={{ fontSize: calculatefontSize(1.9), }}>
                                                    {item?.name}
                                                </MyText>
                                            </TouchableOpacity>
                                        )}
                                        visible={values?.isOpenCategory}
                                        data={categoryData}
                                        searchKey="name"
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

export default CreateInternalLogs

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