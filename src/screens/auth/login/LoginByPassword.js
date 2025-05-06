import { Alert, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import MyText from '../../../components/MyText'
import { COLORS } from '../../../constants'
import { calculatefontSize } from '../../../helper/responsiveHelper'
import InputText from '../../../components/InputText'
import TouchableButton from '../../../components/TouchableButton'
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library you're using




const validationSchema = Yup.object().shape({
    companyUrl: Yup.string().required('Company URL is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const LoginByPassword = ({ navigation ,route}) => {
    const email = route?.params?.email
    const [loader, setLoader] = React.useState(false)

    const LoginByPassword = async (values) => {
        if (!values?.password) {
            Alert.alert('Password is required')
            return
        }
        setLoader(true)
        setTimeout(() => {
            setLoader(false)
            navigation.navigate('Otp',{userEmail:email})
        }, 2000)
    }

    return (
        <ImageBackground blurRadius={2} source={require("../../../assets/Images/bgimage.png")} style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
            <View >
                <Image tintColor={COLORS?.whiteColors} source={{ uri: "https://api.iclayn.com/assets/logo-DuQxixZj.png" }} style={{ width: 150, height: 50, resizeMode: "contain", }} />
            </View>
            <Formik
                initialValues={{ companyUrl: '', email: '', password: '' }}
                // validationSchema={validationSchema}
                onSubmit={LoginByPassword}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.loginContainer}>
                       
                        <View style={{ marginVertical: 20,flexDirection:'row',alignItems:"center",justifyContent:'space-between' }}>
                            <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                                <Icon name={'email'} size={22} color={COLORS.LIGHT_COLOR} />
                                <MyText style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.9) }}>{email}</MyText>

                            </View>
                            <TouchableOpacity onPress={() => navigation.goBack()} >
                                <MyText  style={{ color: COLORS?.whiteColors, fontSize: calculatefontSize(1.9) }}>Change</MyText>
                            </TouchableOpacity>
                        </View>
                        <InputText secureTextEntry={true} iconName={'key'} value={values.password} onChangeText={handleChange('password')} placeholder={'Password'} />
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

export default LoginByPassword

const styles = StyleSheet.create({
    loginContainer: {

        // backgroundColor: COLORS?.PRIMARY_COLOR,
        // padding: 20,
        // paddingVertical: 30
    }
})
