import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import MyText from '../../components/MyText'
import InputText from '../../components/InputText'
import TouchableButton from '../../components/TouchableButton'
import { API_URL, BASE_URL, COLORS, IconUri, X_TENANT_ID } from '../../constants'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { calculatefontSize } from '../../helper/responsiveHelper'

import { HttpStatusCode } from 'axios'
import httpRequest from '../../api/apiHandler'

const validationSchema = Yup.object().shape({

    email: Yup.string().email('Invalid email').required('Email is required'),

})

const Login = ({ navigation }) => {
    const [loader, setLoader] = React.useState(false)

    const login = async (values) => {

        setLoader(true)

        const { res, status, err } = await httpRequest({
            path: `/ic/un-auth/user/${values.email}`,
            header: { "X_TENANT_ID": X_TENANT_ID }
        });
        if (status === HttpStatusCode.NoContent) {
            console.log('No account associated with this email. Please try again or register.');
            setLoader(false);
            return;
        }
        if (res) {
            console.log(res,"res data");
            setLoader(false)
            navigation.navigate('LoginByPassword', { email: values.email,emailData:res?.data })

        } else {
            console.log("err", err);

        }
        setLoader(false);
    }

    return (
        <ImageBackground blurRadius={2} source={require("../../assets/Images/bgimage.png")} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <View >
                <Image tintColor={COLORS?.whiteColors} source={{ uri: `${BASE_URL}/assets/logo-DuQxixZj.png` }} style={{ width: 150, height: 50, resizeMode: "contain", }} />
            </View>
            <Formik
                initialValues={{ email: 'sa@yopmail.com', }}
                validationSchema={validationSchema}
                onSubmit={login}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.loginContainer}>
                        <InputText iconName={'email'} value={values.email} onChangeText={handleChange('email')} extraStyle={{ marginTop: 30 }} placeholder={'Email'} />
                        {touched.email && errors.email && <MyText style={{ color: 'red' }}>{errors.email}</MyText>}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 }}>
                            <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                                <MyText style={{ color: COLORS?.whiteColors, textAlign: 'right', fontSize: calculatefontSize(1.9) }}>Forgot Password?</MyText>
                            </TouchableOpacity>
                        </View>
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

export default Login

const styles = StyleSheet.create({
    loginContainer: {

        // backgroundColor: COLORS?.PRIMARY_COLOR,
        // padding: 20,
        // paddingVertical: 30
    }
})
