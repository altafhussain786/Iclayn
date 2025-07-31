import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, Text, TextInputComponent, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-native-date-picker';
import { useToast } from 'react-native-toast-notifications'
import ScreenHeader from '../../components/ScreenHeader'
import Wrapper from '../../components/Wrapper'
import MyText from '../../components/MyText'
import TextInputWithTitle from '../../components/TextInputWithTitle'
import { calculatefontSize } from '../../helper/responsiveHelper'
import { COLORS } from '../../constants'
import AddButton from '../../components/AddButton'
import httpRequest from '../../api/apiHandler'
import BottomModalListWithSearch from '../../components/BottomModalListWithSearch'
import ReminderItems from '../tabs/tasks/components/ReminderItems'
import { addReminderItem } from '../../store/slices/taskSlice/createItemforReminder'

//icons 
import AntDesign from 'react-native-vector-icons/AntDesign';




const Event = ({ navigation }) => {
  const dispatch = useDispatch()
  const toast = useToast();
  const [firmUserData, setFirmUserData] = useState([])
  const items = useSelector(state => state.createItemforReminder.items);

  const [matterData, setmatterData] = React.useState([]);
  const [eventTypeData, seteventTypeData] = React.useState([]);
  const [billingData, setBillingData] = React.useState([]);
  const [partyData, setPartyData] = React.useState([]);


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
          path: '/ic/another-api/?status=Pending', // yeh second API ka actual path daalna hoga
          navigation: navigation
        })
      ]);

      if (customerResponse?.res) {
        setBillingData(customerResponse.res.data);
      } else {
        console.log(customerResponse?.err, 'GET CUSTOMER RESPONSE===>err');
      }

      if (anotherResponse?.res) {
        setPartyData(anotherResponse.res.data); // is function ko aapko useState se define karna hoga
      } else {
        console.log(anotherResponse?.err, 'SECOND API RESPONSE===>err');
      }

    } catch (error) {
      console.log('Unexpected error in Promise.all =>', error);
    }

    // const { res, err } = await httpRequest({
    //   method: `get`,
    //   path: `/ic/user/?status=Active`,
    //   navigation: navigation
    // })
    // if (res) {
    //   setBillingData(res?.data);
    // }
    // else {
    //   console.log(err, "GET CUSTOMER RESPONSE===>err");
    // }
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

  useEffect(() => {
    getEventTypeData()
    getBillingData()
    getMatterData()
    getFirmUserData()
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
            title: '',

            //firm User
            firmUser: '',
            firmItems: [],
            firmUserObj: {},
            isOpenFirmUser: false,

            //start data/time
            isOpenStartDate: false,
            startDate: '',
            selectedStartDate: new Date(), // 👈 must be a Date object

            //end date/time
            isOpenEndDate: false,
            endDate: '',
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
          }
        }
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldValue }) => {
          console.log(values, "EVENT CREATE ====>");
          const payload = {}

        }}
      >

        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (

          <>
            <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Create Event" />
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

                  <TextInputWithTitle title='Title' value={values.title} onChangeText={(txt) => setFieldValue('title', txt)} placeholder={'Title'} isRequired={true} />
                  {
                    errors.title && touched.title && (
                      <MyText style={{ color: 'red' }}>{errors.title}</MyText>
                    )
                  }
                  <TextInputWithTitle
                    title="Find firm users or contacts to invite"
                    isButton={true}
                    isRequired={true}
                    buttonText={values.firmUser || 'Select FirmUser'}
                    onPressButton={() => setFieldValue('isOpenFirmUser', true)}
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
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, paddingVertical: 10, borderColor: '#ddd', }}>
                    <MyText style={styles.title}>Is Repeate ?</MyText>
                    <Switch
                      value={values.isRepeated}
                      onValueChange={(val) => setFieldValue('isRepeated', val)}
                      thumbColor={values.isRepeated ? "#ffffff" : "#ffffff"}
                      trackColor={{ false: "gray", true: COLORS?.PRIMARY_COLOR_LIGHT }}
                    />
                  </View>

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

              {/* ====>//FIrm user list */}
              <BottomModalListWithSearch
                onClose={() => setFieldValue('isOpenFirmUser', false)}
                renderItem={({ item }) => (
                  console.log(item, "ITEMS====>"),

                  <TouchableOpacity
                    onPress={() => {
                      const alreadyExists = values.firmItems.find(
                        (i) => i.userId === item.userId
                      );
                      if (!alreadyExists) {
                        setFieldValue('firmItems', [...values.firmItems, item]);
                      }
                      else {
                        Alert.alert('Client already added');
                      }
                      setFieldValue('firmUserObj', item);
                      setFieldValue('firmUser', item?.userProfileDTO?.fullName || '');
                      setFieldValue('isOpenFirmUser', false);
                    }}
                    style={styles.itemStyle}
                  >

                    <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                      {item?.companyName || item?.userProfileDTO?.fullName}
                    </MyText>
                  </TouchableOpacity>
                )}
                visible={values?.isOpenFirmUser}
                data={[...billingData, ...partyData]}
                searchKey={"email"}
              />

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
                mode='datetime'
                open={values.isOpenStartDate}
                date={values.selectedStartDate || new Date()}
                onConfirm={date => {
                  setFieldValue('startDate', `${moment(date).format('MM/DD/YYYY')} : ${moment(date).format('hh:mm A')}`);
                  setFieldValue('selectedStartDate', date); // ✅ keep as Date object
                  setFieldValue('isOpenStartDate', false);
                }}
                onCancel={() => {
                  setFieldValue('isOpenStartDate', false);
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


export default Event

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