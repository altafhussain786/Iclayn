import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { COLORS } from '../../constants';
import ScreenHeader from '../../components/ScreenHeader';
import MyText from '../../components/MyText';
import Wrapper from '../../components/Wrapper';
import { calculatefontSize } from '../../helper/responsiveHelper';

const Profile = ({ navigation }) => {
    const [form, setForm] = useState({
        initials: 'Mr.',
        firstName: 'System',
        lastName: 'Admin',
        country: 'United Kingdom',
        street1: 'MacDonald Street',
        street2: 'Street 2',
        city: 'Birmingham',
        postalCode: '54000b',
        region: 'punjab',
        phone: '+447311444225',
        selectedColor: '#f87171',
    });

    const colorOptions = [
        '#a5b4fc', '#facc15', '#a3a3a3',
        '#86efac', '#fcd34d', '#fb923c',
        '#f87171', '#0ea5e9', '#22c55e'
    ];

    const handleInputChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    return (
        <>
            <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Profile" />
            <Wrapper>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Profile Info */}
                    <View style={styles.profileRow}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                            style={styles.avatar}
                        />
                        <View>
                            <MyText style={styles.userName}>System Admin</MyText>
                            <MyText style={styles.emailText}>sa@yopmail.com</MyText>
                        </View>
                        <TouchableOpacity
                            style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}
                            onPress={() => navigation.navigate('ChangePassword')}
                        >
                            <MyText style={styles.changePass}>Change Password?</MyText>
                            <AntDesign name="edit" color={COLORS.PRIMARY_COLOR} size={14} />
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formGroup}>
                        {[
                            { label: 'Initials', key: 'initials' },
                            { label: 'First Name', key: 'firstName', required: true },
                            { label: 'Last Name', key: 'lastName', required: true },
                            { label: 'Country', key: 'country', required: true },
                            { label: 'Street 1', key: 'street1', required: true },
                            { label: 'Street 2', key: 'street2' },
                            { label: 'City', key: 'city', required: true },
                            { label: 'ZIP/Postal Code', key: 'postalCode', required: true },
                            { label: 'Region', key: 'region' },
                            { label: 'Phone', key: 'phone', required: true },
                        ].map(field => (
                            <View key={field.key} style={styles.inputGroup}>
                                <MyText style={styles.inputLabel}>
                                    {field.label} {field.required && <Text style={{ color: 'red' }}>*</Text>}
                                </MyText>
                                <TextInput
                                    style={styles.input}
                                    value={form[field.key]}
                                    onChangeText={val => handleInputChange(field.key, val)}
                                    placeholder={field.label}
                                    placeholderTextColor="#aaa"
                                />
                            </View>
                        ))}

                        {/* Color Selector */}
                        <View style={{ marginTop: 15 }}>
                            <MyText style={styles.inputLabel}>Select Color</MyText>
                            <View style={styles.colorRow}>
                                {colorOptions.map(color => (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => handleInputChange('selectedColor', color)}
                                        style={[
                                            styles.colorCircle,
                                            {
                                                backgroundColor: color,
                                                borderWidth: form.selectedColor === color ? 2 : 0,
                                                borderColor: COLORS.BLACK_COLOR,
                                            },
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveBtn}>
                        <MyText style={styles.saveBtnText}>Save</MyText>
                    </TouchableOpacity>
                </ScrollView>
            </Wrapper>
        </>
    );
};

export default Profile;

const styles = StyleSheet.create({
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 10,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: '#eee',
    },
    userName: {
        fontSize: calculatefontSize(2),
        fontWeight: 'bold',
        color: COLORS.BLACK_COLOR,
    },
    emailText: {
        color: COLORS.GREY_COLOR,
        fontSize: calculatefontSize(1.4),
    },
    changePass: {
        color: COLORS.PRIMARY_COLOR,
        marginRight: 5,
        fontSize: calculatefontSize(1.5),
    },
    formGroup: {
        padding: 10,
    },
    inputGroup: {
        marginBottom: 10,
    },
    inputLabel: {
        fontSize: calculatefontSize(1.6),
        color: COLORS.BLACK_COLOR,
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.BORDER_LIGHT_COLOR,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: calculatefontSize(1.6),
        color: COLORS.BLACK_COLOR,
        backgroundColor: '#fff',
    },
    colorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginTop: 10,
    },
    colorCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
    },
    saveBtn: {
        marginTop: 20,
        marginHorizontal: 10,
        backgroundColor: COLORS.PRIMARY_COLOR,
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
