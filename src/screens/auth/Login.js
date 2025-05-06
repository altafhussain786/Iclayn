import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LogoText from '../../components/LogoText'
import MyText from '../../components/MyText'
import InputText from '../../components/InputText'
import TouchableButton from '../../components/TouchableButton'
import { COLORS, IconUri } from '../../constants'
import { Formik } from 'formik'
import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
    companyUrl: Yup.string().required('Company URL is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

const Login = ({ navigation }) => {
    const [loader, setLoader] = React.useState(false)

    const login = async (values) => {
        setLoader(true)
        setTimeout(() => {
            setLoader(false)
            navigation.navigate('BottomTabNavigation')
        }, 2000)
    }

    return (
        <View  style={{ flex: 1, justifyContent: 'center' }}>
            <Formik
                initialValues={{ companyUrl: '', email: '', password: '' }}
                // validationSchema={validationSchema}
                onSubmit={login}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={styles.loginContainer}>
                        <TouchableButton isLoading={loader} onPress={handleSubmit} title='Login' />
                    </View>
                )}
            </Formik>

            
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    loginContainer: {
        // backgroundColor: COLORS?.PRIMARY_COLOR,
        padding: 20,
        paddingVertical: 30
    }
})
