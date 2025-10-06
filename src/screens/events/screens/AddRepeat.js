import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import moment from 'moment'
import DatePicker from 'react-native-date-picker';
import ScreenHeader from '../../../components/ScreenHeader'
import Wrapper from '../../../components/Wrapper'
import MyText from '../../../components/MyText'
import TextInputWithTitle from '../../../components/TextInputWithTitle'
import { calculatefontSize } from '../../../helper/responsiveHelper'
import { COLORS } from '../../../constants'
import BottomModalListWithSearch from '../../../components/BottomModalListWithSearch'
import { useDispatch } from 'react-redux'
import { setRepeat } from '../../../store/slices/eventSlice/createItemForAddRepeat'

const AddRepeat = ({ navigation, route }) => {
    const paramData = route?.params?.paramData
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        repeat: Yup.string().required('Repeat type is required'),
    })

    return (
        <Formik
            initialValues={{
                repeat: paramData?.repeat || "",
                every: paramData?.every || "",
                endType: paramData?.endType || "Never",   // Default
                endOccurrences: paramData?.endOccurrences || "", // only for "After"
                endDate: paramData?.endDate || "",        // save string only
                isRepeatObj: paramData?.isRepeatObj || {},
                isRepeatOpen: false,
                isOpenEndDate: false,
                loader: false
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                // ✅ safe string values store karenge
                dispatch(setRepeat(values));
                navigation.goBack();
                console.log("updatedPayload===============>", values);
                // navigation.goBack();

            }}
        >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
                <>
                    <ScreenHeader
                        isLoading={values?.loader}
                        onPressSave={handleSubmit}
                        isShowSave={true}
                        extraStyle={{ backgroundColor: '#F5F6F8' }}
                        isGoBack={true}
                        onPress={() => { navigation.goBack() }}
                        isShowTitle={true}
                        title="Add Repeat"
                    />

                    <Wrapper>
                        <KeyboardAvoidingView
                            style={{ flex: 1 }}
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                        >
                            <ScrollView contentContainerStyle={{ paddingBottom: 50 }} showsVerticalScrollIndicator={false}>

                                {/* Repeat */}
                                <TextInputWithTitle
                                    setFieldValue={setFieldValue}
                                    onPressButton={() => setFieldValue('isRepeatOpen', !values.isRepeatOpen)}
                                    title="Repeat"
                                    isButton={true}
                                    buttonText={values.repeat || 'Select Repeat '}
                                />

                                {/* Every */}
                                <TextInputWithTitle
                                    value={values.every}
                                    title="Every"
                                    placeholder={values.repeat == "Daily" ? 'Days' : values.repeat == "Weekly" ? 'Weeks' : 'Months'}
                                    keyboardType='numeric'
                                    buttonText={
                                        values.repeat == "Daily" ? 'Days' :
                                            values.repeat == "Weekly" ? 'Weeks' : 'Months'
                                    }
                                    onChangeText={(text) => setFieldValue('every', text)}
                                />

                                {/* END OPTIONS */}
                                <MyText style={[styles.label, { marginTop: 20 }]}>End</MyText>
                                <View style={styles.radioGroup}>
                                    {["Never", "After", "On"].map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={styles.radioOption}
                                            onPress={() => setFieldValue("endType", type)}
                                        >
                                            <View style={[
                                                styles.radioCircle,
                                                values.endType === type && { borderColor: COLORS.PRIMARY_COLOR_LIGHT }
                                            ]}>
                                                {values.endType === type && <View style={styles.radioDot} />}
                                            </View>
                                            <MyText style={{ marginLeft: 8 }}>{type}</MyText>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                {/* IF AFTER */}
                                {values.endType === "After" && (
                                    <View style={{ marginTop: 10 }}>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Enter occurrences"
                                            value={values.endOccurrences}
                                            onChangeText={(text) => setFieldValue("endOccurrences", text)}
                                        />
                                        <MyText style={{ color: COLORS.GREY_COLOR, marginTop: 5 }}>
                                            occurrence(s)
                                        </MyText>
                                    </View>
                                )}

                                {/* IF ON */}
                                {values.endType === "On" && (
                                    <View style={{ marginTop: 10 }}>
                                        <TouchableOpacity
                                            style={styles.input}
                                            onPress={() => setFieldValue("isOpenEndDate", true)}
                                        >
                                            <MyText>
                                                {moment(values.endDate).isValid()
                                                    ? moment(values.endDate).format("DD MMM YYYY")
                                                    : "Select end date"}
                                            </MyText>
                                        </TouchableOpacity>
                                        <MyText style={{ color: COLORS.GREY_COLOR, marginTop: 5 }}>
                                            End on {moment(values.endDate).isValid()
                                                ? moment(values.endDate).format("DD MMM YYYY")
                                                : "--/--/----"}
                                        </MyText>
                                    </View>
                                )}

                                {/* SUMMARY */}
                                <View style={{ marginTop: 20 }}>
                                    <MyText>
                                        {values?.endType === "Never"
                                            ? `Summary: Repeats every ${values?.every || 0} ${values?.isRepeatObj?.value || ""}.`
                                            : values?.endType === "After"
                                                ? `Summary: Repeats every ${values?.every || 0} ${values?.isRepeatObj?.value || ""}, ending after ${values?.endOccurrences || 0} occurrence(s).`
                                                : values?.endType === "On"
                                                    ? `Summary: Repeats every ${values?.every || 0} ${values?.isRepeatObj?.value || ""}, ending on ${moment(values?.endDate).isValid() ? moment(values?.endDate).format("DD MMM YYYY") : "Invalid date"}.`
                                                    : ""}
                                    </MyText>
                                </View>

                            </ScrollView>
                        </KeyboardAvoidingView>

                        {/* MODALS */}
                        <BottomModalListWithSearch
                            onClose={() => setFieldValue('isRepeatOpen', false)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        setFieldValue('repeat', item?.name);
                                        setFieldValue('isRepeatObj', item);
                                        setFieldValue('isRepeatOpen', false)
                                    }}
                                    style={styles.itemStyle}
                                >
                                    <MyText style={{ fontSize: calculatefontSize(1.9) }}>
                                        {item?.name}
                                    </MyText>
                                </TouchableOpacity>
                            )}
                            visible={values?.isRepeatOpen}
                            data={[
                                { id: 1, name: "Daily", value: 'days' },
                                { id: 2, name: "Weekly", value: 'weeks' },
                                { id: 3, name: "Monthly", value: 'month' },
                            ]}
                            searchKey="name"
                        />

                        {/* DATE PICKER */}
                        <DatePicker
                            modal
                            mode="date"
                            open={values.isOpenEndDate}
                            date={values.endDate ? new Date(values.endDate) : new Date()}
                            onConfirm={(date) => {
                                // ✅ string save karenge
                                setFieldValue("endDate", date.toISOString());
                                setFieldValue("isOpenEndDate", false);
                            }}
                            onCancel={() => setFieldValue("isOpenEndDate", false)}
                        />

                    </Wrapper>
                </>
            )}
        </Formik>
    )
}

export default AddRepeat

const styles = StyleSheet.create({
    label: {
        fontSize: calculatefontSize(2),
        color: COLORS.GREY_COLOR,
        fontWeight: "bold"
    },
    radioGroup: {
        flexDirection: "row",
        marginTop: 10
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 20
    },
    radioCircle: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#999",
        justifyContent: "center",
        alignItems: "center"
    },
    radioDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.PRIMARY_COLOR_LIGHT
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        padding: 10,
        marginTop: 5
    },
    itemStyle: {
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderColor: COLORS?.BORDER_LIGHT_COLOR
    }
})
