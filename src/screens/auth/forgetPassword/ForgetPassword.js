import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import MyText from '../../../components/MyText'
import InputText from '../../../components/InputText'
import TouchableButton from '../../../components/TouchableButton'
import { COLORS, IconUri } from '../../../constants'
import { calculatefontSize } from '../../../helper/responsiveHelper'



const validationSchema = Yup.object().shape({
    companyUrl: Yup.string().required('Company URL is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const ForgetPassword = ({ navigation }) => {
    const [loader, setLoader] = React.useState(false)

    const ForgetPassword = async (values) => {
        if (!values?.email) {
            Alert.alert('Email is required')
            return

        }
        setLoader(true)
        setTimeout(() => {
            setLoader(false)
            navigation.navigate('ForgetPasswordByPassword')
        }, 2000)
    }

    return (
        <ImageBackground blurRadius={2} source={require("../../../assets/Images/bgimage.png")} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
                <Image tintColor={COLORS?.whiteColors} source={{ uri: "https://api.iclayn.com/assets/logo-DuQxixZj.png" }} style={{ width: 150, height: 50, resizeMode: "contain", }} />
            </View>
            <Formik
                initialValues={{ companyUrl: '', email: '', password: '' }}
                // validationSchema={validationSchema}
                onSubmit={ForgetPassword}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.loginContainer}>
                        <MyText style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.9), marginVertical: 10, fontWeight: 'bold' }}>Reset password </MyText>
                        <MyText style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.5) }}>Please enter the email address used to sign in to your DIDWW account. Password reset instructions will be sent shortly.
                        </MyText>

                        <InputText iconName={'email'} value={values.email} onChangeText={handleChange('email')} extraStyle={{ marginVertical: 20 }} placeholder={'Email'} />


                        <TouchableButton style={{ borderRadius: 100 }} backgroundColor={COLORS?.PRIMARY_COLOR_LIGHT} isLoading={loader} onPress={handleSubmit} title='Login' />
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

export default ForgetPassword

const styles = StyleSheet.create({
    loginContainer: {

        // backgroundColor: COLORS?.PRIMARY_COLOR,
        // padding: 20,
        // paddingVertical: 30
    }
})
