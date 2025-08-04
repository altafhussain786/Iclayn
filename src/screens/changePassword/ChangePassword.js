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

const ChangePassword = ({ navigation }) => {
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
                    <TouchableOpacity style={styles.saveBtn}>
                        <MyText style={styles.saveBtnText}>Save</MyText>
                    </TouchableOpacity>
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
