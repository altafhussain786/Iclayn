

// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
// } from 'react-native';
// import { Formik } from 'formik';
// import moment from 'moment';
// import LinearGradient from 'react-native-linear-gradient';

// import ScreenHeader from '../../../../components/ScreenHeader';
// import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
// import MyText from '../../../../components/MyText';
// import TextInputWithTitle from '../../../../components/TextInputWithTitle';
// import { COLORS } from '../../../../constants';
// import DatePicker from 'react-native-date-picker';
// import httpRequest from '../../../../api/apiHandler';
// import LoaderKit from 'react-native-loader-kit'
// import { calculatefontSize } from '../../../../helper/responsiveHelper';


// const CreateTransferAdvance = ({ navigation }) => {
//     const [matterFromData, setMatterFromData] = useState([]);
//     const [matterData, setMatterData] = useState([]);
//     const [matterId, setMatterId] = useState(0);
//     const [balanceData, setBalanceData] = useState({});
//     const [loader, setLoader] = useState(false);

//     const getMatterFromData = async () => {
//         const { res, err } = await httpRequest
//             ({
//                 method: `get`,
//                 path: `/ic/matter/listing`,
//                 navigation: navigation
//             })
//         if (res) {
//             setMatterFromData(res?.data);
//         }
//         else {
//             console.log(err, "GET CUSTOMER RESPONSE===>err");
//         }
//     }
//     useEffect(() => {
//         getMatterFromData();
//     }, [])
//     const getBalanceData = async () => {
//         setLoader(true)
//         const { res, err } = await httpRequest
//             ({
//                 method: `get`,
//                 path: `/ic/payment/matter/${matterId}/deposit`,
//                 navigation: navigation
//             })
//         if (res) {
//             setLoader(false)

//             setBalanceData(res?.data);
//         }
//         else {
//             setLoader(false)

//             console.log(err, "GET CUSTOMER RESPONSE===>err");
//         }
//     }

//     useEffect(() => {
//         getBalanceData();
//     }, [matterId])





//     useEffect(() => {
//         setMatterData([
//             { name: 'Matter A', matterId: 1 },
//             { name: 'Matter B', matterId: 2 },
//         ]);
//     }, []);

//     return (
//         <Formik
//             // enableReinitialize
//             initialValues={{
//                 fromMatter: '',
//                 fromMatterObj: {},
//                 isFromMatterOpen: false,
//                 toMatter: '',
//                 toMatterObj: {},
//                 isToMatterOpen: false,
//                 transferAmount: '',
//                 avaliableBalance: balanceData?.depositAmount || 0,
//                 note: '',
//                 date: moment().format('DD/MM/YYYY'),
//                 selectedDate: new Date(),
//                 isDateOpen: false,
//             }}
//             onSubmit={(values) => {
//                 console.log('Transfer Advance Payload:', values);
//             }}
//         >
//             {({ handleChange, handleSubmit, values, setFieldValue }) => (
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                     style={{ flex: 1 }}
//                 >
//                     <LinearGradient colors={['#f6f7fb', '#e9ecf5']} style={styles.wrapper}>
//                         <ScreenHeader
//                             title="Transfer Advance"
//                             isShowTitle={true}
//                             isGoBack={true}
//                             onPress={() => navigation.goBack()}
//                             onPressSave={handleSubmit}
//                         />

//                         <ScrollView
//                             contentContainerStyle={styles.container}
//                             keyboardShouldPersistTaps="handled"
//                         >
//                             <View style={styles.glassCard}>
//                                 <TextInputWithTitle
//                                     title="Date"
//                                     isButton
//                                     buttonText={values.date}
//                                     onPressButton={() => setFieldValue('isDateOpen', true)}
//                                 />

//                                 <View style={styles.matterRow}>
//                                     <View style={styles.matterColumn}>
//                                         <TextInputWithTitle
//                                             title="Matter From"
//                                             isButton
//                                             buttonText={values.fromMatter || 'Select...'}
//                                             onPressButton={() =>
//                                                 setFieldValue('isFromMatterOpen', true)
//                                             }
//                                         />
//                                     </View>
//                                     <Text style={styles.arrowIcon}>Revert</Text>
//                                     <View style={styles.matterColumn}>
//                                         <TextInputWithTitle
//                                             title="Matter To"
//                                             isButton
//                                             buttonText={values.toMatter || 'Select...'}
//                                             onPressButton={() =>
//                                                 setFieldValue('isToMatterOpen', true)
//                                             }
//                                         />
//                                     </View>
//                                 </View>

//                                 {loader ? <LoaderKit
//                                     style={{ width: 30, height: 30 }}
//                                     name={'BallSpinFadeLoader'} // Optional: see list of animations below
//                                     color={COLORS?.LIGHT_COLOR} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
//                                 /> : <TextInputWithTitle title="Available" editable={false} value={`£ ${balanceData?.depositAmount?.toString() || 0}`} />}

//                                 <TextInputWithTitle
//                                     title="Transfer Amount"
//                                     placeholder="Enter amount"
//                                     keyboardType="numeric"
//                                     value={values.transferAmount}
//                                     onChangeText={handleChange('transferAmount')}
//                                 />

//                                 <Text style={styles.amountLabel}>
//                                     Transfer Amount: £ {values.transferAmount || '0.00'}
//                                 </Text>

//                                 <TextInputWithTitle
//                                     title="Note"
//                                     placeholder="Enter note"
//                                     value={values.note}
//                                     onChangeText={handleChange('note')}
//                                     multiline
//                                 />

//                                 <View style={styles.buttonRow}>
//                                     <LinearGradient
//                                         colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
//                                         style={styles.saveButton}
//                                     >
//                                         <TouchableOpacity onPress={handleSubmit}>
//                                             <Text style={styles.saveButtonText}>Transfer</Text>
//                                         </TouchableOpacity>
//                                     </LinearGradient>

//                                     <TouchableOpacity
//                                         style={styles.cancelButton}
//                                         onPress={() => navigation.goBack()}
//                                     >
//                                         <Text style={styles.cancelButtonText}>Cancel</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>

//                             {/* From Matter Modal */}
//                             <BottomModalListWithSearch
//                                 visible={values.isFromMatterOpen}
//                                 onClose={() => setFieldValue('isFromMatterOpen', false)}
//                                 data={matterFromData}
//                                 searchKey="name"
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity
//                                         onPress={() => {
//                                             setMatterId(item?.matterId);
//                                             setFieldValue('fromMatter', item.name);
//                                             setFieldValue('fromMatterObj', item);
//                                             setFieldValue('isFromMatterOpen', false);
//                                         }}
//                                         style={styles.itemStyle}
//                                     >
//                                         <MyText>{item.name}</MyText>
//                                     </TouchableOpacity>
//                                 )}
//                             />

//                             {/* To Matter Modal */}
//                             <BottomModalListWithSearch
//                                 visible={values.isToMatterOpen}
//                                 onClose={() => setFieldValue('isToMatterOpen', false)}
//                                 data={matterFromData?.filter(item => item.matterId !== values.fromMatterObj?.matterId)}
//                                 searchKey="name"
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity
//                                         onPress={() => {

//                                             // setFieldValue('setMatterId', item?.matterId);
//                                             setFieldValue('toMatter', item.name);
//                                             setFieldValue('toMatterObj', item);
//                                             setFieldValue('isToMatterOpen', false);
//                                         }}
//                                         style={styles.itemStyle}
//                                     >
//                                         <MyText>{item.name}</MyText>
//                                     </TouchableOpacity>
//                                 )}
//                             />

//                             <DatePicker
//                                 modal
//                                 open={values.isDateOpen}
//                                 date={values.selectedDate}
//                                 mode="date"
//                                 onConfirm={(date) => {
//                                     setFieldValue('selectedDate', date);
//                                     setFieldValue('date', moment(date).format('DD/MM/YYYY'));
//                                     setFieldValue('isDateOpen', false);
//                                 }}
//                                 onCancel={() => setFieldValue('isDateOpen', false)}
//                             />
//                         </ScrollView>
//                     </LinearGradient>
//                 </KeyboardAvoidingView>
//             )}
//         </Formik>
//     );
// };

// export default CreateTransferAdvance;

// const styles = StyleSheet.create({
//     wrapper: {
//         flex: 1,
//     },
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//     },
//     glassCard: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         borderRadius: 16,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 5,
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//     },
//     matterRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginVertical: 12,
//     },
//     matterColumn: {
//         // width: '45%',
//     },
//     arrowIcon: {
//         // fontSize: calculatefontSize(1.9),
//         color: '#888',
//         paddingHorizontal: 6,
//     },
//     amountLabel: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.PRIMARY_COLOR,
//         marginTop: 8,
//         marginBottom: 12,
//     },
//     buttonRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 30,
//     },
//     saveButton: {
//         flex: 1,
//         padding: 15,
//         borderRadius: 12,
//         marginRight: 10,
//         alignItems: 'center',
//         // shadowColor: '#4facfe',
//         // shadowOffset: { width: 0, height: 6 },
//         // shadowOpacity: 0.25,
//         // shadowRadius: 10,
//         // elevation: 6,
//         // borderWidth: 1,
//         // borderColor: '#4facfe',
//         // backgroundColor: '#4facfe',
//     },
//     cancelButton: {
//         flex: 1,
//         backgroundColor: '#f0f0f0',
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#ccc',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 4,
//     },
//     saveButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     cancelButtonText: {
//         color: '#333',
//         fontWeight: '600',
//         fontSize: 16,
//     },
//     itemStyle: {
//         padding: 15,
//         borderBottomWidth: 1,
//         borderColor: '#eee',
//         backgroundColor: '#fff',
//     },
// });
// ========================================================================>
// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     ScrollView,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
// } from 'react-native';
// import { Formik } from 'formik';
// import moment from 'moment';
// import LinearGradient from 'react-native-linear-gradient';

// import ScreenHeader from '../../../../components/ScreenHeader';
// import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
// import MyText from '../../../../components/MyText';
// import TextInputWithTitle from '../../../../components/TextInputWithTitle';
// import { COLORS } from '../../../../constants';
// import DatePicker from 'react-native-date-picker';
// import httpRequest from '../../../../api/apiHandler';
// import LoaderKit from 'react-native-loader-kit'
// import AntDesing from 'react-native-vector-icons/AntDesign';

// const CreateTransferAdvance = ({ navigation }) => {
//     const [matterFromData, setMatterFromData] = useState([]);
//     const [matterData, setMatterData] = useState([]);
//     const [matterId, setMatterId] = useState(0);
//     const [balanceData, setBalanceData] = useState({});
//     const [loader, setLoader] = useState(false);

//     const getMatterFromData = async () => {
//         const { res, err } = await httpRequest({
//             method: `get`,
//             path: `/ic/matter/listing`,
//             navigation: navigation
//         });
//         if (res) {
//             setMatterFromData(res?.data);
//         } else {
//             console.log(err, "GET CUSTOMER RESPONSE===>err");
//         }
//     };

//     useEffect(() => {
//         getMatterFromData();
//     }, []);

//     const getBalanceData = async () => {
//         setLoader(true);
//         const { res, err } = await httpRequest({
//             method: `get`,
//             path: `/ic/payment/matter/${matterId}/deposit`,
//             navigation: navigation
//         });
//         if (res) {
//             setLoader(false);
//             setBalanceData(res?.data);
//         } else {
//             setLoader(false);
//             console.log(err, "GET CUSTOMER RESPONSE===>err");
//         }
//     };

//     useEffect(() => {
//         getBalanceData();
//     }, [matterId]);

//     return (
//         <Formik
//             initialValues={{
//                 fromMatter: '',
//                 fromMatterObj: {},
//                 isFromMatterOpen: false,
//                 toMatter: '',
//                 toMatterObj: {},
//                 isToMatterOpen: false,
//                 transferAmount: '',
//                 avaliableBalance: balanceData?.depositAmount || 0,
//                 note: '',
//                 date: moment().format('DD/MM/YYYY'),
//                 selectedDate: new Date(),
//                 isDateOpen: false,
//             }}
//             onSubmit={(values) => {
//                 console.log('Transfer Advance Payload:', values);
//             }}
//         >
//             {({ handleChange, handleSubmit, values, setFieldValue }) => (
//                 <KeyboardAvoidingView
//                     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                     style={{ flex: 1 }}
//                 >
//                     <LinearGradient colors={['#f6f7fb', '#e9ecf5']} style={styles.wrapper}>
//                         <ScreenHeader
//                             title="Transfer Advance"
//                             isShowTitle={true}
//                             isGoBack={true}
//                             onPress={() => navigation.goBack()}
//                             onPressSave={handleSubmit}
//                         />

//                         <ScrollView
//                             contentContainerStyle={styles.container}
//                             keyboardShouldPersistTaps="handled"
//                         >
//                             <View style={styles.glassCard}>
//                                 <TextInputWithTitle
//                                     title="Date"
//                                     isButton
//                                     buttonText={values.date}
//                                     onPressButton={() => setFieldValue('isDateOpen', true)}
//                                 />

//                                 <View style={styles.matterRow}>
//                                     <View style={styles.matterColumn}>
//                                         <TextInputWithTitle
//                                             title="Matter From"
//                                             isButton
//                                             buttonText={values.fromMatter || 'Select...'}
//                                             onPressButton={() =>
//                                                 setFieldValue('isFromMatterOpen', true)
//                                             }
//                                         />
//                                     </View>

//                                     <TouchableOpacity
//                                         onPress={() => {
//                                             const fromMatter = values.fromMatter;
//                                             const fromMatterObj = values.fromMatterObj;
//                                             const toMatter = values.toMatter;
//                                             const toMatterObj = values.toMatterObj;

//                                             setFieldValue('fromMatter', toMatter);
//                                             setFieldValue('fromMatterObj', toMatterObj);
//                                             setFieldValue('toMatter', fromMatter);
//                                             setFieldValue('toMatterObj', fromMatterObj);

//                                             if (toMatterObj?.matterId) {
//                                                 setMatterId(toMatterObj.matterId);
//                                             } else {
//                                                 setMatterId(0);
//                                             }
//                                         }}
//                                         style={styles.revertButton}
//                                     >
//                                         <AntDesing name="swap" size={25} color="#015354" />
//                                     </TouchableOpacity>

//                                     <View style={styles.matterColumn}>
//                                         <TextInputWithTitle
//                                             title="Matter To"
//                                             isButton
//                                             buttonText={values.toMatter || 'Select...'}
//                                             onPressButton={() =>
//                                                 setFieldValue('isToMatterOpen', true)
//                                             }
//                                         />
//                                     </View>
//                                 </View>

//                                 {loader ? (
//                                     <LoaderKit
//                                         style={{ width: 30, height: 30 }}
//                                         name={'BallSpinFadeLoader'}
//                                         color={COLORS?.LIGHT_COLOR}
//                                     />
//                                 ) : (
//                                     <TextInputWithTitle
//                                         title="Available"
//                                         editable={false}
//                                         value={`£ ${balanceData?.depositAmount?.toString() || 0}`}
//                                     />
//                                 )}

//                                 <TextInputWithTitle
//                                     title="Transfer Amount"
//                                     placeholder="Enter amount"
//                                     keyboardType="numeric"
//                                     value={values.transferAmount}
//                                     onChangeText={handleChange('transferAmount')}
//                                 />

//                                 <Text style={styles.amountLabel}>
//                                     Transfer Amount: £ {values.transferAmount || '0.00'}
//                                 </Text>

//                                 <TextInputWithTitle
//                                     title="Note"
//                                     placeholder="Enter note"
//                                     value={values.note}
//                                     onChangeText={handleChange('note')}
//                                     multiline
//                                 />

//                                 <View style={styles.buttonRow}>
//                                     <LinearGradient
//                                         colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
//                                         style={styles.saveButton}
//                                     >
//                                         <TouchableOpacity onPress={handleSubmit}>
//                                             <Text style={styles.saveButtonText}>Transfer</Text>
//                                         </TouchableOpacity>
//                                     </LinearGradient>

//                                     <TouchableOpacity
//                                         style={styles.cancelButton}
//                                         onPress={() => navigation.goBack()}
//                                     >
//                                         <Text style={styles.cancelButtonText}>Cancel</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>

//                             {/* From Matter Modal */}
//                             <BottomModalListWithSearch
//                                 visible={values.isFromMatterOpen}
//                                 onClose={() => setFieldValue('isFromMatterOpen', false)}
//                                 data={matterFromData}
//                                 searchKey="name"
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity
//                                         onPress={() => {
//                                             setMatterId(item?.matterId);
//                                             setFieldValue('fromMatter', item.name);
//                                             setFieldValue('fromMatterObj', item);
//                                             setFieldValue('isFromMatterOpen', false);
//                                         }}
//                                         style={styles.itemStyle}
//                                     >
//                                         <MyText>{item.name}</MyText>
//                                     </TouchableOpacity>
//                                 )}
//                             />

//                             {/* To Matter Modal */}
//                             <BottomModalListWithSearch
//                                 visible={values.isToMatterOpen}
//                                 onClose={() => setFieldValue('isToMatterOpen', false)}
//                                 data={matterFromData?.filter(item => item.matterId !== values.fromMatterObj?.matterId)}
//                                 searchKey="name"
//                                 renderItem={({ item }) => (
//                                     <TouchableOpacity
//                                         onPress={() => {
//                                             setFieldValue('toMatter', item.name);
//                                             setFieldValue('toMatterObj', item);
//                                             setFieldValue('isToMatterOpen', false);
//                                         }}
//                                         style={styles.itemStyle}
//                                     >
//                                         <MyText>{item.name}</MyText>
//                                     </TouchableOpacity>
//                                 )}
//                             />

//                             <DatePicker
//                                 modal
//                                 open={values.isDateOpen}
//                                 date={values.selectedDate}
//                                 mode="date"
//                                 onConfirm={(date) => {
//                                     setFieldValue('selectedDate', date);
//                                     setFieldValue('date', moment(date).format('DD/MM/YYYY'));
//                                     setFieldValue('isDateOpen', false);
//                                 }}
//                                 onCancel={() => setFieldValue('isDateOpen', false)}
//                             />
//                         </ScrollView>
//                     </LinearGradient>
//                 </KeyboardAvoidingView>
//             )}
//         </Formik>
//     );
// };

// export default CreateTransferAdvance;

// const styles = StyleSheet.create({
//     wrapper: {
//         flex: 1,
//     },
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//     },
//     glassCard: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         borderRadius: 16,
//         padding: 20,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 8,
//         elevation: 5,
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//     },
//     matterRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginVertical: 12,
//     },
//     matterColumn: {
//         width: '40%',
//     },
//     revertButton: {
//         backgroundColor: '#eee',
//         paddingVertical: 8,
//         paddingHorizontal: 12,
//         borderRadius: 8,
//     },
//     revertText: {
//         color: '#555',
//         fontWeight: '600',
//     },
//     amountLabel: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: COLORS.PRIMARY_COLOR,
//         marginTop: 8,
//         marginBottom: 12,
//     },
//     buttonRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 30,
//     },
//     saveButton: {
//         flex: 1,
//         padding: 15,
//         borderRadius: 12,
//         marginRight: 10,
//         alignItems: 'center',
//     },
//     cancelButton: {
//         flex: 1,
//         backgroundColor: '#f0f0f0',
//         padding: 15,
//         borderRadius: 12,
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#ccc',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 4 },
//         shadowOpacity: 0.1,
//         shadowRadius: 6,
//         elevation: 4,
//     },
//     saveButtonText: {
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: 16,
//     },
//     cancelButtonText: {
//         color: '#333',
//         fontWeight: '600',
//         fontSize: 16,
//     },
//     itemStyle: {
//         padding: 15,
//         borderBottomWidth: 1,
//         borderColor: '#eee',
//         backgroundColor: '#fff',
//     },
// });
// ============================================================================>

import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Animated,
    Dimensions,
} from 'react-native';
import { Formik } from 'formik';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';

import ScreenHeader from '../../../../components/ScreenHeader';
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
import MyText from '../../../../components/MyText';
import TextInputWithTitle from '../../../../components/TextInputWithTitle';
import { COLORS } from '../../../../constants';
import httpRequest from '../../../../api/apiHandler';
import LoaderKit from 'react-native-loader-kit';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { calculatefontSize } from '../../../../helper/responsiveHelper';
import { useToast } from 'react-native-toast-notifications';

const { width } = Dimensions.get('window');

const CreateTransferAdvance = ({ navigation }) => {
    const [matterFromData, setMatterFromData] = useState([]);
    const [matterId, setMatterId] = useState(0);
    const [balanceData, setBalanceData] = useState({});
    const [loader, setLoader] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const toast = useToast();

    const getMatterFromData = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/matter/listing`,
            navigation: navigation,
        });
        if (res) {
            setMatterFromData(res?.data);
        } else {
            console.log(err, 'GET CUSTOMER RESPONSE===>err');
        }
    };

    useEffect(() => {
        getMatterFromData();
    }, []);

    const getBalanceData = async () => {
        setLoader(true);
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/payment/matter/${matterId}/deposit`,
            navigation: navigation,
        });
        if (res) {
            setLoader(false);
            setBalanceData(res?.data);
        } else {
            setLoader(false);
            console.log(err, 'GET BALANCE ERROR');
        }
    };

    useEffect(() => {
        getBalanceData();
    }, [matterId]);

    const animateSwap = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.6,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Formik

            initialValues={{
                fromMatter: '',
                fromMatterObj: {},
                isFromMatterOpen: false,

                toMatter: '',
                toMatterObj: {},
                isToMatterOpen: false,

                transferAmount: '',
                avaliableBalance: balanceData?.depositAmount || 0,
                note: '',
                date: moment().format('DD/MM/YYYY'),
                selectedDate: new Date(),
                isDateOpen: false,
                loader: false
            }}
            onSubmit={(values, { setFieldValue }) => {
                console.log('values', values);
                if (values.fromMatterObj?.matterId === values.toMatterObj?.matterId) {
                    toast.show('Please select different matter', { type: 'danger' })
                    return
                }

                const payload = {
                    fromMatterId: values?.fromMatterObj?.matterId,
                    toMatterId: values?.toMatterObj?.matterId,
                    amount: values?.transferAmount,
                    notes: values?.note
                }
                console.log(payload, "PAYLOAD");
                setFieldValue('loader', true)
                const { res, err } = httpRequest({
                    method: `put`,
                    path: `/ic/payment/transfer-fund`,
                    params: payload,
                    navigation: navigation
                })
                if (res) {
                    setFieldValue('loader', false)

                    // navigation.goBack()
                    toast.show('Transfer Successfully', { type: 'success' })
                }
                else {
                    setFieldValue('loader', false)

                    console.log(err, 'GET CUSTOMER RESPONSE===>err');

                }


            }}
        >
            {({ handleChange, handleSubmit, values, setFieldValue }) => (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <LinearGradient colors={['#f6f7fb', '#e9ecf5']} style={styles.wrapper}>
                        <ScreenHeader isLoading={values?.loader} onPressSave={handleSubmit} isShowSave={true} extraStyle={{ backgroundColor: '#F5F6F8' }} isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Transfer Advance" />
                        <ScrollView
                            style={{ backgroundColor: COLORS?.whiteColors }}
                            contentContainerStyle={styles.container}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.glassCard}>
                                <TextInputWithTitle
                                    title="Date"
                                    isButton
                                    buttonText={values.date}
                                    onPressButton={() => setFieldValue('isDateOpen', true)}
                                />

                                <View style={styles.matterRow}>
                                    <View style={styles.matterColumn}>
                                        <TextInputWithTitle
                                            title="Matter From"
                                            isButton
                                            buttonText={values.fromMatter || 'Select...'}
                                            onPressButton={() =>
                                                setFieldValue('isFromMatterOpen', true)
                                            }
                                        />
                                    </View>

                                    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                                        <LinearGradient
                                            colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
                                            style={styles.revertButton}
                                        >
                                            <TouchableOpacity
                                                onPress={() => {
                                                    animateSwap();
                                                    const fromMatter = values.fromMatter;
                                                    const fromMatterObj = values.fromMatterObj;
                                                    const toMatter = values.toMatter;
                                                    const toMatterObj = values.toMatterObj;

                                                    setFieldValue('fromMatter', toMatter);
                                                    setFieldValue('fromMatterObj', toMatterObj);
                                                    setFieldValue('toMatter', fromMatter);
                                                    setFieldValue('toMatterObj', fromMatterObj);

                                                    if (toMatterObj?.matterId) {
                                                        setMatterId(toMatterObj.matterId);
                                                    } else {
                                                        setMatterId(0);
                                                    }
                                                }}
                                            // style={styles.revertButton}
                                            >
                                                <AntDesign name="swap" size={25} color={COLORS?.whiteColors} />
                                            </TouchableOpacity>
                                        </LinearGradient>
                                    </Animated.View>

                                    <View style={styles.matterColumn}>
                                        <TextInputWithTitle
                                            title="Matter To"
                                            isButton
                                            buttonText={values.toMatter || 'Select...'}
                                            onPressButton={() =>
                                                setFieldValue('isToMatterOpen', true)
                                            }
                                        />
                                    </View>
                                </View>

                                {loader ? (
                                    <LoaderKit
                                        style={{ width: 30, height: 30 }}
                                        name={'BallSpinFadeLoader'}
                                        color={COLORS?.LIGHT_COLOR}
                                    />
                                ) : (
                                    <TextInputWithTitle
                                        title="Available"
                                        editable={false}
                                        value={`£ ${balanceData?.depositAmount?.toString() || 0}`}
                                    />
                                )}

                                <TextInputWithTitle
                                    title="Transfer Amount"
                                    placeholder="Enter amount"
                                    keyboardType="numeric"
                                    value={values.transferAmount}
                                    onChangeText={handleChange('transferAmount')}
                                />

                                <TextInputWithTitle
                                    title="Note"
                                    placeholder="Enter note"
                                    value={values.note}
                                    onChangeText={handleChange('note')}
                                    multiline
                                />

                                <View style={styles.buttonRow}>
                                    <LinearGradient
                                        colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
                                        style={styles.saveButton}
                                    >
                                        {values?.loader ? <LoaderKit style={{ width: 20, height: 20 }} name={'BallSpinFadeLoader'} color={COLORS?.whiteColors} /> : <TouchableOpacity onPress={handleSubmit}>
                                            <Text style={styles.saveButtonText}>Transfer</Text>
                                        </TouchableOpacity>}
                                    </LinearGradient>

                                    <TouchableOpacity

                                        style={styles.cancelButton}
                                        onPress={() => navigation.goBack()}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Modals */}
                            <BottomModalListWithSearch
                                visible={values.isFromMatterOpen}
                                onClose={() => setFieldValue('isFromMatterOpen', false)}
                                data={matterFromData}
                                searchKey="name"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setMatterId(item?.matterId);
                                            setFieldValue('fromMatter', item.name);
                                            setFieldValue('fromMatterObj', item);
                                            setFieldValue('isFromMatterOpen', false);
                                        }}
                                        style={styles.itemStyle}
                                    >
                                        <MyText>{item.name}</MyText>
                                    </TouchableOpacity>
                                )}
                            />

                            <BottomModalListWithSearch
                                visible={values.isToMatterOpen}
                                onClose={() => setFieldValue('isToMatterOpen', false)}
                                data={matterFromData?.filter(
                                    (item) => item.matterId !== values.fromMatterObj?.matterId
                                )}
                                searchKey="name"
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setFieldValue('toMatter', item.name);
                                            setFieldValue('toMatterObj', item);
                                            setFieldValue('isToMatterOpen', false);
                                        }}
                                        style={styles.itemStyle}
                                    >
                                        <MyText>{item.name}</MyText>
                                    </TouchableOpacity>
                                )}
                            />

                            <DatePicker
                                modal
                                open={values.isDateOpen}
                                date={values.selectedDate}
                                mode="date"
                                onConfirm={(date) => {
                                    setFieldValue('selectedDate', date);
                                    setFieldValue('date', moment(date).format('DD/MM/YYYY'));
                                    setFieldValue('isDateOpen', false);
                                }}
                                onCancel={() => setFieldValue('isDateOpen', false)}
                            />
                        </ScrollView>
                    </LinearGradient>
                </KeyboardAvoidingView>
            )}
        </Formik>
    );
};

export default CreateTransferAdvance;

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    container: {

        padding: 20,
    },
    glassCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    matterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginVertical: 15,
    },
    matterColumn: {
        width: width * 0.3,
    },
    revertButton: {
        backgroundColor: '#ddd',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    revertText: {
        fontSize: 20,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    saveButton: {
        flex: 1,
        padding: 15,
        borderRadius: 12,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        // fontWeight: 'bold',
        fontSize: calculatefontSize(1.9),
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: '600',
        fontSize: 16,
    },
    itemStyle: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
});
