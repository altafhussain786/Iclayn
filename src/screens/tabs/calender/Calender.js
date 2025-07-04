
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

const SCREEN_WIDTH = Dimensions.get('window').width;

const Calender = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loader, setLoader] = useState(false);
  const [calenderData, setCalenderData] = useState([]);

  //modal
  const [modalVisible, setModalVisible] = useState(false);


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
    let toDate = getToDate(fromDate);
    const currentStartOfWeek = getStartOfWeek(new Date());

    if (selectedDate >= currentStartOfWeek && selectedDate <= getToDate(currentStartOfWeek)) {
      fromDate = currentStartOfWeek;
    }

    const selectedDateStr = moment(selectedDate).format('MM/DD/YYYY');
    setLoader(true);
    const { res, err } = await httpRequest({
      method: 'get',
      // navigation: navigation,
      path: `/ic/event/date-range?fromDate=${selectedDateStr}&toDate=${selectedDateStr}`,
    });

    if (res) {
      console.log(res, "res=======CALENDER==d=======>", `/ic/event/date-range?fromDate=${selectedDateStr}&toDate=${selectedDateStr}`);

      setCalenderData(res?.data);
    } else {
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

  useEffect(() => {
    setSelectedDate(currentWeek[3].date); // default center day
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
            style={{ height: 35, width: 35,  resizeMode: 'contain' }}
          />
        </TouchableOpacity>
      </View>

      {/* Animated Week Strip */}
      <View style={{ backgroundColor: COLORS?.whiteColors }}>
        <View style={styles.tabContainer} {...panResponder.panHandlers}>
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
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('CalenderDetails', { item })} style={{ flexDirection: 'row', gap: 10 }}>
                <View>
                  <Image
                    source={IconUri?.CalenderColor}
                    style={{ height: 20, width: 20, resizeMode: 'contain', top: getResponsiveHeight(3) }}
                  />
                </View>
                <View style={{ width: '100%' }}>
                  <View style={[styles.eventItem]}>
                    <View style={{ width: '65%' }}>
                      <MyText style={styles.timeColor}>
                        {moment(item.eventScheduleDTOList[0]?.startOnTime).format('hh:mm A')} -{' '}
                        {moment(item.eventScheduleDTOList[0]?.endOnTime).format('hh:mm A')}
                      </MyText>
                      <MyText style={[styles.txtStyle, { fontWeight: '300' }]}>
                        {item.title}
                      </MyText>
                      {item?.description && (
                        <MyText style={[styles.timeColor, { width: '70%' }]}>{item?.description}</MyText>
                      )}
                    </View>
                    <View style={{ width: '35%' }}>
                      {item?.location && (
                        <MyText style={[styles.timeColor, { fontWeight: '300' }]}>{item?.location}</MyText>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getCalenderData} />}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Image  source={IconUri?.Calender} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
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
