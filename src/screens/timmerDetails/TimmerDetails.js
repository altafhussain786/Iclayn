import { AppState, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenHeader from '../../components/ScreenHeader';
import TimmerComponent from './components/TimmerComponent';
import { COLORS } from '../../constants';
import { calculatefontSize } from '../../helper/responsiveHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';
import { ContentContainer } from '../tabs/calender/screens/CalenderDetails';
import LinearGradient from 'react-native-linear-gradient';

const TIMER_KEY = 'TIMEKEEPER_STATE';

const TimmerDetails = ({ navigation }) => {
    const [duration, setDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [description, setDescription] = useState('No description');
    const [matter, setMatter] = useState('No matter');
    const intervalRef = useRef(null);


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
        console.log(data,"Timmer details");
        
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
        <>
            <ScreenHeader
                isGoBack={true}
                onPress={() => navigation.goBack()}
                isShowTitle={true}
                title="Time entry"
            />
            <LinearGradient
                colors={[ COLORS?.PRIMARY_COLOR,COLORS?.PRIMARY_COLOR_LIGHT,]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                >
            {/* <View > */}
                <TimmerComponent
                    isShowLoader={false}
                    title={formatTime(duration)}
                    description={'Today, 25 June at 10:00 AM'}
                />
                <TouchableOpacity onPress={toggleTimer} style={styles.timerBar}>
                    <FontAwesome name={isRunning ? 'pause' : 'play'} size={16} color="white" />
                    <Text style={styles.timerText}>{isRunning ? 'stop timer' : 'start timer'}</Text>
                </TouchableOpacity>
            {/* </View> */}
            </LinearGradient>
             <ContentContainer title='Duration' />
             <ContentContainer title='Matter' />
             <ContentContainer title='Activity category' />
             <ContentContainer title='Date' />
             <ContentContainer title='Description' />
             <ContentContainer title='Rate' />
             <ContentContainer title='Location' />
        </>
    );
};

export default TimmerDetails;

const styles = StyleSheet.create({
    timerBar: {
        backgroundColor: COLORS?.PRIMARY_COLOR,
        // marginTop: 15,
        margin: 20,
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
});
