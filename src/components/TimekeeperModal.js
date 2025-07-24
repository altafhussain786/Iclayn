import React, { useState, useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    AppState,
    Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLORS, IconUri } from '../constants';
import { calculatefontSize } from '../helper/responsiveHelper';
import { useIsFocused } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const TIMER_KEY = 'TIMEKEEPER_STATE';





const TimekeeperModal = ({ visible, onClose, navigation }) => {
    const [description, setDescription] = useState('No description');
    const [matter, setMatter] = useState('No matter');
    const [duration, setDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const intervalRef = useRef(null);
    const options = [
        { label: 'Matter', icon: 'briefcase', onPress: () => navigation.navigate("CreateMatter"), iconName: IconUri?.matter },
        { label: 'Task', icon: 'check-square', onPress: () => navigation.navigate("CreateTask"), iconName: IconUri?.task },
        { label: 'Event', icon: 'calendar', onPress: () => navigation.navigate("Event"), iconName: IconUri?.Calender },
        { label: 'Billing', icon: 'Bill', onPress: () => navigation.navigate("CreateBilling"), iconName: IconUri?.bill },
        { label: 'Time entry', icon: 'clock-o', onPress: () => navigation.navigate("CreateTimeEntry"), iconName: IconUri?.clock },
        { label: 'Expense', icon: 'file-text', onPress: () => navigation.navigate("CreateExpense"), iconName: IconUri?.matter },
        { label: 'Client', icon: 'file-text', onPress: () => navigation.navigate("CreateClients"), iconName: IconUri?.client },
        { label: 'Parties', icon: 'file-text', onPress: () => navigation.navigate("CreateParties"), iconName: IconUri?.parties },
    ];




    useEffect(() => {
        loadTimer();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (state) => {
            if (state === 'active') {
                loadTimer(); // recalculate time when returning to app
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const loadTimer = async () => {
        const json = await AsyncStorage.getItem(TIMER_KEY);
        if (json) {
            const data = JSON.parse(json);
            setDescription(data.description || 'No description');
            setMatter(data.matter || 'No matter');
            setIsRunning(data.isRunning || false);
            setStartTime(data.startTime || null);

            if (data.isRunning && data.startTime) {
                const elapsed =
                    Math.floor((Date.now() - new Date(data.startTime).getTime()) / 1000) +
                    (data.duration || 0);
                setDuration(elapsed);
                startTimer(true);
            } else {
                setDuration(data.duration || 0);
            }
        }
    };

    const saveTimerState = async (extra = {}) => {
        const data = {
            description,
            matter,
            duration,
            isRunning,
            startTime,
            ...extra,
        };
        console.log(data, "Timmer details");

        await AsyncStorage.setItem(TIMER_KEY, JSON.stringify(data));
    };

    const startTimer = async (resume = false) => {
        const start = resume ? startTime : new Date().toISOString();
        if (!resume) {
            setStartTime(start);
            await saveTimerState({ isRunning: true, startTime: start });
        }
        setIsRunning(true);
        console.log('⏱ Timer started');

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setDuration((prev) => prev + 1);
        }, 1000);
    };

    const stopTimer = async () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        console.log('⏸ Timer stopped');
        await saveTimerState({ isRunning: false, duration });
    };

    const toggleTimer = () => {
        isRunning ? stopTimer() : startTimer();
    };

    const formatTime = (sec) => {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="close" size={20} color={COLORS?.RED_COLOR} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.timekeeperTitle}>Timekeeper</Text>
                            <Text style={styles.subtext}>
                                ● {description} ({matter})
                            </Text>
                        </View>
                        <View style={{ justifyContent: "center", alignItems: "center" }}>
                            <TouchableOpacity onPress={() => { onClose(), navigation.navigate("EditTimeEntry") }}>
                                <Text style={styles.addDetails}>Edit Time Entry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { onClose(), navigation.navigate("TimmerDetails") }}>
                                <Text style={styles.addDetails}>View</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={toggleTimer} >
                        <LinearGradient
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={[COLORS?.PRIMARY_COLOR_LIGHT, COLORS?.PRIMARY_COLOR]}
                            style={styles.timerBar}
                        >

                            <FontAwesome name={isRunning ? 'pause' : 'play'} size={16} color="white" />
                            <Text style={styles.timerText}>{formatTime(duration)}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.sectionTitle}>Create new</Text>
                    <Text style={styles.swipeHint}>Swipe left to see all options</Text>
                    <FlatList
                        contentContainerStyle={styles.containerStyle}
                        horizontal
                        data={options}
                        keyExtractor={(item) => item.label}
                        renderItem={({ item }) => (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                {/* <LinearGradient
                                    start={{ x: 1, y: 0 }}
                                    end={{ x: 0, y: 1 }}
                                    colors={[ '#fff','#fff']}
                                    style={styles.optionItem}
                                    > */}
                                <TouchableOpacity style={styles.optionItem} onPress={() => { onClose(), item.onPress() }} >
                                    <Image source={item.iconName} style={{ height: 40, width: 50, resizeMode: "contain" }} />
                                    {/* <FontAwesome name={item.icon} size={30} color="#B6F0E2" /> */}
                                </TouchableOpacity>
                                {/* </LinearGradient> */}
                                <Text style={styles.optionLabel}>{item.label}</Text>
                            </View>
                        )}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalHeader: {
        alignItems: 'flex-end',
    },
    containerStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: '#00000066',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    timekeeperTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    subtext: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    addDetails: {
        color: COLORS?.PRIMARY_COLOR_LIGHT,
        fontSize: calculatefontSize(1.9),
        fontWeight: 'bold',
    },
    timerBar: {
        backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT,
        marginTop: 15,
        paddingVertical: 12,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    timerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    sectionTitle: {
        marginTop: 20,
        fontWeight: '600',
        fontSize: 14,
    },
    swipeHint: {
        color: '#777',
        fontSize: 12,
        marginBottom: 10,
    },
    optionItem: {
        // backgroundColor: '#007E7B',
        // padding: 15,
        // paddingTop: 20,

        borderRadius: 8,
        width: 80,
        alignItems: 'center',
        // marginRight: 10,
    },
    optionLabel: {
        fontSize: calculatefontSize(1.5),
        fontWeight: 'bold',
        marginTop: 4,
        color: COLORS?.BLACK_COLOR,
    },
});

export default TimekeeperModal;
