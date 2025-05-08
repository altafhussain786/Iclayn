import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import MyText from '../../../components/MyText'
import { API_URL, BASE_URL, COLORS } from '../../../constants'
import { calculatefontSize } from '../../../helper/responsiveHelper'
import InputText from '../../../components/InputText'
import TouchableButton from '../../../components/TouchableButton'
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library you're using
import { OtpInput } from "react-native-otp-entry";
import httpRequest from '../../../api/apiHandler'



const validationSchema = Yup.object().shape({
    otp: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Otp = ({ navigation, route }) => {
    const userEmail = route?.params?.userEmail
    const [loader, setLoader] = React.useState(false)

    const Otp = async (values) => {
        setLoader(true)
        const { res, err } = await httpRequest({
            method: "post",
            path: `/ic/auth/submit-login/${values.otp}`,
        })
        if (res) {
            setLoader(false)
            console.log(res, 'login res==========>');
            navigation.navigate('BottomTabNavigation')
        }
        else {
            setLoader(false)
            console.log("err", err);
        }

        // setLoader(true)
        // setTimeout(() => {
        //     setLoader(false)
        //     navigation.navigate('BottomTabNavigation')
        // }, 2000)
    }

    function maskEmail(email) {
        const [local, domain] = email.split('@');
        const maskedLocal = local[0] + '***';
        const [domainName, domainExt] = domain.split('.');
        const maskedDomain = domainName.slice(0, 3) + '***';

        return `${maskedLocal}@${maskedDomain}.${domainExt}`;
    }

    return (
        <ImageBackground blurRadius={2} source={require("../../../assets/Images/bgimage.png")} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <View >
                <Image tintColor={COLORS?.whiteColors} source={{ uri: `${BASE_URL}/assets/logo-DuQxixZj.png` }} style={{ width: 150, height: 50, resizeMode: "contain", }} />
            </View>
            <Formik
                initialValues={{ otp: '' }}
                validationSchema={validationSchema}
                onSubmit={Otp}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <View style={styles.loginContainer}>

                        <MyText style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.9), marginVertical: 10, fontWeight: 'bold' }}>Enter your verification code     </MyText>
                        <MyText style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.5) }}>Please check your email {maskEmail(userEmail)} for asking a six-digit code and enter it below to sign in
                        </MyText>
                        <View style={{ marginVertical: 20 }}>
                            <OtpInput
                                numberOfDigits={6}
                                focusColor="green"
                                autoFocus={false}
                                hideStick={true}
                                placeholder="------"
                                blurOnFilled={true}
                                disabled={false}
                                type="numeric"
                                secureTextEntry={false}
                                focusStickBlinkingDuration={500}
                                onFocus={() => console.log("Focused")}
                                onBlur={() => console.log("Blurred")}
                                onTextChange={(text) => console.log(text)}
                                onFilled={(text) => setFieldValue('otp', text)}
                                textInputProps={{
                                    accessibilityLabel: "One-Time Password",
                                }}
                                textProps={{
                                    accessibilityRole: "text",
                                    accessibilityLabel: "OTP digit",
                                    allowFontScaling: false,
                                }}
                                theme={{
                                    containerStyle: styles.container,
                                    pinCodeContainerStyle: styles.pinCodeContainer,
                                    pinCodeTextStyle: styles.pinCodeText,
                                    focusStickStyle: styles.focusStick,
                                    // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
                                    // placeholderTextStyle: styles.placeholderText,
                                    // filledPinCodeContainerStyle: styles.filledPinCodeContainer,
                                    // disabledPinCodeContainerStyle: styles.disabledPinCodeContainer,
                                }}
                            />

                        </View>
                        {errors.otp && touched.otp && <MyText style={{ color: 'red', fontSize: calculatefontSize(1.5) }}>{errors.otp}</MyText>}
                        <View style={{ marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <MyText style={{ color: COLORS?.whiteColors }}>Didn't receive a code?</MyText>
                            <TouchableOpacity>
                                <MyText style={{ color: COLORS?.whiteColors }}>Try again</MyText>
                            </TouchableOpacity>
                        </View>
                        <TouchableButton style={{ borderRadius: 100 }} backgroundColor={COLORS?.PRIMARY_COLOR_LIGHT} isLoading={loader} onPress={handleSubmit} title='Submit' />
                    </View>
                )}
            </Formik>

            <View style={{ marginTop: 60 }}>
                {/* <Image tintColor={"black"} resizeMode='contain' source={IconUri?.sdcLogo} style={{ width: 80, height: 80, alignSelf: "center", top: 20 }} /> */}
                <Text style={{ fontSize: 13, textAlign: "center", opacity: 0.5, color: COLORS?.whiteColors }}>© 2025 Iclayn, All rights reserved.</Text>
            </View>
        </ImageBackground>
    )
}

export default Otp

const styles = StyleSheet.create({
    containerStyle: {
        // backgroundColor: 'red',
        // borderRadius: 10,
        // padding: 20,
        // marginVertical: 10
    },
    pinCodeContainer: {
        backgroundColor: COLORS?.whiteColors,
        height: 50,
        borderRadius: 10,
        // borderRadius: 10,
        // padding: 20,
        // marginVertical: 10
    },
    pinCodeTextStyle: {
        color: COLORS?.PRIMARY_COLOR,
        fontSize: calculatefontSize(1.9),
        fontWeight: 'bold'
    }
})
