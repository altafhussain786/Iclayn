

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  PanResponder,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import ScreenHeader from '../../../components/ScreenHeader';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Calender = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);

  const eventsData = [
    { id: 1, date: '2025-05-01', title: 'MAY 1 consultation' },
    { id: 2, date: '2025-05-10', title: 'MAY 2 consultation' },
    { id: 3, date: '2025-06-06', title: 'June with client' },
    { id: 4, date: '2025-04-02', title: 'April Call' },
    { id: 5, date: '2025-07-10', title: 'July session' },
  ];

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sunday) - 6
    d.setDate(d.getDate() - day);
    return d;
  };

  const getWeekDays = (baseDate) => {
    const startOfWeek = getStartOfWeek(baseDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return {
        date,
        dateStr: date.toISOString().split('T')[0],
        day: date.toDateString().slice(0, 3),
        num: date.getDate(),
      };
    });
  };
   // Swipe gesture logic
   const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        setWeekOffset(prev => prev - 1); // swipe right → previous week
      } else if (gestureState.dx < -50) {
        setWeekOffset(prev => prev + 1); // swipe left → next week
      }
    },
  });

  const currentWeek = getWeekDays(
    new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
  );

  useEffect(() => {
    setSelectedDate(currentWeek[3].date); // always center select (Thursday)
  }, [weekOffset]);

  const currentMonthName = selectedDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const filteredEvents = eventsData.filter((event) => {
    const eventMonth = new Date(event.date).getMonth();
    const selectedMonth = selectedDate.getMonth();
    const titleMatch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return eventMonth === selectedMonth && titleMatch;
  });

  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setWeekOffset((prev) => prev + 1);
    } else {
      setWeekOffset((prev) => prev - 1);
    }
  };

  return (
    <>
      <ScreenHeader isShowTitle={true} title="Calendar" />
      <View style={styles.header}>
        <View style={styles.monthContainer}>
          <TouchableOpacity onPress={() => handleSwipe('right')}>
            <AntDesign name={'left'} size={20} color={COLORS?.LIGHT_COLOR} />
          </TouchableOpacity>
          <MyText style={styles.monthText}>{currentMonthName}</MyText>
          <TouchableOpacity onPress={() => handleSwipe('left')}>
            <AntDesign name={'right'} size={20} color={COLORS?.LIGHT_COLOR} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
          <Image
            source={IconUri?.CalenderSearch}
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </View>

      {/* Calendar Week Strip */}
      <View style={styles.tabContainer} {...panResponder.panHandlers}>
        <FlatList
          horizontal
          ref={flatListRef}
          showsHorizontalScrollIndicator={false}
          data={currentWeek}
          keyExtractor={(item) => item.dateStr}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dayButton}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={styles.dayText}>{item.day}</Text>
              <Text
                style={{
                  ...styles.dateText,
                  backgroundColor:
                    selectedDate.toISOString().split('T')[0] === item.dateStr
                      ? COLORS.whiteColors
                      : COLORS.PRIMARY_COLOR,
                  color:
                    selectedDate.toISOString().split('T')[0] === item.dateStr
                      ? COLORS.PRIMARY_COLOR
                      : COLORS.whiteColors,
                }}
              >
                {item.num}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Wrapper>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={{ width: '100%' }}
          placeholder="Search an event"
        />

        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.eventItem}>
              <View>
                <MyText style={styles.timeColor}>
                  {item.date} - 01:30 PM
                </MyText>
                <MyText style={[styles.txtStyle, { fontWeight: '600' }]}>
                  {item.title}
                </MyText>
                <MyText style={styles.timeColor}>Matter name here</MyText>
              </View>
              <View>
                <MyText
                  style={[
                    styles.timeColor,
                    { fontWeight: '600', textAlign: 'right' },
                  ]}
                >
                  $50.00
                </MyText>
                <MyText style={[styles.txtStyle, { textAlign: 'right' }]}>
                  01:00:00
                </MyText>
                <View style={styles.draftBox}>
                  <MyText style={styles.draftText}>Draft</MyText>
                </View>
              </View>
            </View>
          )}
        />

        <FloatingButton
          icon="plus"
          navigateTo="CreateScreen"
          backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
          size={50}
          iconSize={25}
        />
      </Wrapper>

      {showMonthPicker && (
        <DateTimePicker
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
          value={selectedDate}
          onChange={(event, date) => {
            setShowMonthPicker(false);
            if (date) {
              setSelectedDate(date);
              setWeekOffset(0);
            }
          }}
        />
      )}
    </>
  );
};

export default Calender;


const styles = StyleSheet.create({
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.whiteColors,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthText: {
    fontSize: calculatefontSize(2.5),
    color: COLORS?.PRIMARY_COLOR,
    fontWeight: '600',
  },
  tabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.PRIMARY_COLOR,
  },
  dayButton: {
    alignItems: 'center',
    width: 45,
  },
  dayText: {
    color: '#fff',
    fontSize: calculatefontSize(1.5),
    marginVertical: 10,
  },
  dateText: {
    fontSize: calculatefontSize(1.5),
    height: 20,
    width: 20,
    textAlign: 'center',
    borderRadius: 10,
  },
  weekContainer: {
    backgroundColor: COLORS?.PRIMARY_COLOR,
    borderRadius: 10,
    paddingVertical: 20,
    flexDirection: 'row',
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    borderBottomWidth: 1,
    paddingVertical: 15,
    borderColor: COLORS?.BORDER_LIGHT_COLOR,
  },
  timeColor: {
    color: COLORS?.LIGHT_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  txtStyle: {
    color: COLORS?.BLACK_COLOR,
    fontSize: calculatefontSize(1.9),
    fontWeight: '300',
  },
  draftBox: {
    backgroundColor: '#ffc2cd',
    alignSelf: 'flex-end',
    width: '80%',
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  draftText: {
    fontWeight: '600',
    textAlign: 'center',
    color: '#6c0014',
    fontSize: calculatefontSize(1.3),
  },
});
