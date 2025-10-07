import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { COLORS } from '../../../../constants';
import MyText from '../../../../components/MyText';
import { calculatefontSize } from '../../../../helper/responsiveHelper';
// import { COLORS } from '../constants'; // adjust path as needed
// import MyText from './MyText';

const { width } = Dimensions.get('window');

const EditRecurringModal = ({ visible, onClose, onSelect }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <MyText style={styles.title}>Edit recurring event</MyText>

                    <MyText style={styles.subtitle}>
                        Which event(s) would you like to edit?
                    </MyText>

                    <View style={styles.optionContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.optionButton}
                            onPress={() => onSelect('single')}
                        >
                            <MyText style={styles.optionTitle}>This event only</MyText>
                            <MyText style={styles.optionSub}>
                                Other events in the series will remain
                            </MyText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.optionButton}
                            onPress={() => onSelect('all')}
                        >
                            <MyText style={styles.optionTitle}>All events</MyText>
                            <MyText style={styles.optionSub}>
                                All events in the series will be edited, including those changed
                                individually.
                            </MyText>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <MyText style={styles.cancelText}>Cancel</MyText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default EditRecurringModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        width: width * 0.9,
    },
    title: {
        fontSize: calculatefontSize(2),
        fontWeight: '500',
        color: COLORS.BLACK_COLOR,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: calculatefontSize(1.5),
        color: COLORS.LIGHT_COLOR,
        marginBottom: 20,
    },
    optionContainer: {
        gap: 10,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: COLORS.BORDER_LIGHT_COLOR,
        borderRadius: 8,
        padding: 12,
        backgroundColor: COLORS.whiteColors,
    },
    optionTitle: {
        fontSize: 16,
        color: COLORS.PRIMARY_COLOR,
        fontWeight: '600',
    },
    optionSub: {
        fontSize: 13,
        color: COLORS.LIGHT_COLOR,
        marginTop: 3,
    },
    cancelBtn: {
        alignSelf: 'flex-end',
        marginTop: 15,
    },
    cancelText: {
        color: COLORS.PRIMARY_COLOR,
        fontSize: 15,
        fontWeight: '500',
    },
});
