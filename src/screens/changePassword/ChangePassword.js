import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants';
import MyText from '../../components/MyText';
import ScreenHeader from '../../components/ScreenHeader';
import Wrapper from '../../components/Wrapper';
import { calculatefontSize } from '../../helper/responsiveHelper';
import { useToast } from 'react-native-toast-notifications';
import httpRequest from '../../api/apiHandler';
import { useSelector } from 'react-redux';

const ChangePassword = ({ navigation }) => {
    const userDetails = useSelector(state => state?.userDetails?.userDetails);
    const [loader, setLoader] = useState(false);
    const toast = useToast();
    const [form, setForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPass, setShowPass] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });


    };

    const hanldeSubmit = async () => {

        if (form.newPassword !== form.confirmPassword) {
            toast.show('New password and confirm password does not match', { type: 'danger' })
            return
        }
        setLoader(true)
        const { res, err } = await httpRequest({
            method: 'put',
            path: `/ic/user/change-password`,
            params: {
                confirmPassword: form.confirmPassword,
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                userId: userDetails?.userId
            }
        })
        if (res) {
            setLoader(false)
            setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            toast.show('Password updated successfully', { type: 'success' })

        }
        else {
            setLoader(false)

            toast.show(err?.message, { type: 'danger' })
        }
        console.log(form, "form");

    };

    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Change Password" />
            <Wrapper>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {[
                        { label: 'Current Password', key: 'currentPassword' },
                        { label: 'New Password', key: 'newPassword' },
                        { label: 'Confirm New Password', key: 'confirmPassword' },
                    ].map((field) => (
                        <View key={field.key} style={styles.inputGroup}>
                            <MyText style={styles.inputLabel}>
                                {field.label} <MyText style={{ color: 'red' }}>*</MyText>
                            </MyText>
                            <View style={styles.passwordInputContainer}>
                                <TextInput
                                    placeholder={`Enter ${field.label.toLowerCase()}`}
                                    placeholderTextColor="#aaa"
                                    value={form[field.key]}
                                    onChangeText={(val) => handleChange(field.key, val)}
                                    secureTextEntry={!showPass[field.key]}
                                    style={styles.passwordInput}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPass(prev => ({
                                        ...prev,
                                        [field.key]: !prev[field.key],
                                    }))}
                                    style={styles.eyeIcon}
                                >
                                    <AntDesign
                                        name={showPass[field.key] ? 'eye' : 'eyeo'}
                                        size={20}
                                        color={COLORS.GREY_COLOR}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    {/* Save Button */}
                    <View style={styles.saveBtn}>
                        {loader ? <MyText style={styles.saveBtnText}>Please wait...</MyText> : <TouchableOpacity onPress={() => { hanldeSubmit() }} >
                            <MyText style={styles.saveBtnText}>Save</MyText>
                        </TouchableOpacity>}
                    </View>
                </ScrollView>
            </Wrapper>
        </>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    inputGroup: {
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: calculatefontSize(1.6),
        color: COLORS.BLACK_COLOR,
        marginBottom: 5,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: COLORS.BORDER_LIGHT_COLOR,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: calculatefontSize(1.6),
        color: COLORS.BLACK_COLOR,
    },
    eyeIcon: {
        marginLeft: 10,
    },
    saveBtn: {
        backgroundColor: COLORS.PRIMARY_COLOR,
        marginHorizontal: 10,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: calculatefontSize(1.8),
    },
});
