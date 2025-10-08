
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
  Animated,
  RefreshControl,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize, getResponsiveHeight } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import ScreenHeader from '../../../components/ScreenHeader';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import httpRequest from '../../../api/apiHandler';
import moment from 'moment';
import Loader from '../../../components/Loader';
import TimekeeperModal from '../../../components/TimekeeperModal';
import LinearGradient from 'react-native-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';
import EditRecurringModal from './screens/EditRecurringModal';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Calender = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loader, setLoader] = useState(false);
  const [calenderData, setCalenderData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);


  const translateX = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef(null);

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - day);
    return d;
  };

  const getToDate = (fromDate) => {
    const startOfWeek = getStartOfWeek(fromDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  const getCalenderData = async () => {
    let fromDate = selectedDate;



    const currentStartOfWeek = getStartOfWeek(new Date());

    if (selectedDate >= currentStartOfWeek && selectedDate <= getToDate(currentStartOfWeek)) {
      fromDate = currentStartOfWeek;
    }


    const selectedDateStr = moment(selectedDate).format('MM/DD/YYYY');

    // previous Sunday nikalne ke liye
    const fromDate1 = moment(selectedDateStr, 'MM/DD/YYYY')
      .startOf('week') // by default Sunday se week start hota hai
      .format('MM/DD/YYYY');

    // next Sunday nikalne ke liye
    const toDate = moment(selectedDateStr, 'MM/DD/YYYY')
      .endOf('week') // ye Saturday deta hai
      .add(1, 'day') // Saturday + 1 day = Sunday
      .format('MM/DD/YYYY');

    console.log('fromDate:', fromDate1);
    console.log('toDate:', toDate);
    setLoader(true);
    const { res, err } = await httpRequest({
      method: 'get',
      // navigation: navigation,
      path: `/ic/event/date-range?fromDate=${fromDate1}&toDate=${toDate}`,
      // path: `/ic/event/date-range?fromDate=10/05/2025&toDate=10/12/2025`,
    });

    if (res) {
      setCalenderData(res?.data);
    } else {
      console.log(err, "err");

      setCalenderData([]);
    }
    setLoader(false);
  };



  useEffect(() => {
    getCalenderData();
  }, [selectedDate]);

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

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) =>
      Math.abs(gestureState.dx) > 20,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        handleSwipe('right');
      } else if (gestureState.dx < -50) {
        handleSwipe('left');
      }
    },
  });

  const currentWeek = getWeekDays(
    new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
  );

  // useEffect(() => {
  //   setSelectedDate(currentWeek[3].date); // default center day
  // }, [weekOffset]);
  useEffect(() => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(today);
    const endOfWeek = getToDate(today);

    const currentCenterDate = currentWeek[3].date;

    // If we are in current week, set today's date
    if (currentCenterDate >= startOfWeek && currentCenterDate <= endOfWeek) {
      setSelectedDate(today);
    } else {
      setSelectedDate(currentCenterDate); // center date of week
    }
  }, [weekOffset]);

  const handleSwipe = (direction) => {
    const toValue = direction === 'left' ? -SCREEN_WIDTH : SCREEN_WIDTH;
    Animated.timing(translateX, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      translateX.setValue(0);
      setWeekOffset((prev) => direction === 'left' ? prev + 1 : prev - 1);
    });
  };

  const currentMonthName = selectedDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const renderLeftActions = (item) => (
    <TouchableOpacity
      // onPress={() => navigation.navigate('EditEvent', { item })}
      onPress={() => {
        setSelectedEvent(item); // store current event
        setEditModalVisible(true);
      }}
      style={styles.leftSwipe}
    >
      <AntDesign name="edit" size={20} color={COLORS.BLACK_COLOR} />
    </TouchableOpacity>
  );

  const renderRightActions = (item) => (
    <TouchableOpacity
      onPress={() => handleDeleteEvent(item)}
      style={[styles.leftSwipe, { backgroundColor: COLORS.RED_COLOR }]}
    >
      <AntDesign name="delete" size={20} color={COLORS.whiteColors} />
    </TouchableOpacity>
  );


  const renderEventItem = ({ item }) => (
    <Swipeable
      key={item?.id}
      renderLeftActions={() => renderLeftActions(item)}
      renderRightActions={() => renderRightActions(item)}
      overshootLeft={false}
      overshootRight={false}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('CalenderDetails', { item })}
        style={styles.card}
      >
        <View style={styles.headerRow}>
          <MyText style={styles.codeText}>{item?.title || 'No Title'}</MyText>
          <View style={[styles.statusBadge]}>
            <MyText style={styles.statusText}>
              {moment(item.eventScheduleDTOList[0]?.startOnTime).format('hh:mm A')}
            </MyText>
          </View>
        </View>
        {item?.description ? (
          <MyText style={styles.descText1}>{item?.description}</MyText>
        ) : null}
        {item?.location ? (
          <MyText style={styles.dateText1}>{item?.location}</MyText>
        ) : null}
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <>
      <ScreenHeader onPress={() => { navigation.navigate("Settings") }} isShowTitle={true} title="Calendar" />
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
            source={IconUri?.Calender}
            style={{ height: 35, width: 35, resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </View>

      {/* Animated Week Strip */}
      <View style={{ backgroundColor: COLORS?.whiteColors }}>
        <LinearGradient
          colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.tabContainer} {...panResponder.panHandlers}

        >
          <View >
            <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
              {currentWeek.map((item) => (
                <TouchableOpacity
                  key={item.dateStr}
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
              ))}
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      <Wrapper>
        <View style={{ bottom: 25 }}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            containerStyle={{ width: '100%' }}
            placeholder="Search an event"
          />
        </View>
        {loader ? (
          <Loader />
        ) : calenderData?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={calenderData}
            keyExtractor={(item) => item.matterId}
            renderItem={renderEventItem}

            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getCalenderData} />}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Image source={IconUri?.Calender} tintColor={COLORS.PRIMARY_COLOR} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
            <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
          </View>
        )}
        <FloatingButton
          onPress={() => setModalVisible(true)}
          icon="plus"
          navigateTo="CreateScreen"
          backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
          size={50}
          iconSize={25}
        />
        <TimekeeperModal navigation={navigation} visible={modalVisible} onClose={() => setModalVisible(false)} />
        <EditRecurringModal
          key={Math.random() * 1000}
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          onSelect={(type) => {
            setEditModalVisible(false);
            if (type === 'single') {
              // Alert.alert('single');
              setEditModalVisible(false);

              navigation.navigate('EditEvent', {
                eventData: selectedEvent,
                editType: type, // 'single' or 'all'
              });

              // handle "this event only"
            } else {
              // Alert.alert('double');

              setEditModalVisible(false);

              navigation.navigate('EditEvent', {
                eventData: selectedEvent,
                editType: type, // 'single' or 'all'
              });
              // handle "all events"
            }
          }}
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
  leftSwipe: {
    backgroundColor: COLORS.BORDER_LIGHT_COLOR,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginVertical: 6,
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  card: {
    backgroundColor: COLORS.BORDER_LIGHT_COLOR,
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#ccc',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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
    margin: 10,
    borderRadius: 10,
    bottom: 15,
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
  dateText1: {
    fontSize: calculatefontSize(1.5),
    borderRadius: 10,
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
    color: COLORS?.PRIMARY_COLOR,
    fontSize: calculatefontSize(1.9),
    fontWeight: '300',
  },
});
