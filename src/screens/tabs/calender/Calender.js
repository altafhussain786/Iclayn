

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

const SCREEN_WIDTH = Dimensions.get('window').width;

const Calender = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ✅ for refresh

  const [searchQuery, setSearchQuery] = useState('');
  const flatListRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [calenderData, setCalenderData] = useState([]);
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 (Sunday) - 6
    d.setDate(d.getDate() - day);
    return d;
  };

  const getToDate = (fromDate) => {
    const startOfWeek = getStartOfWeek(fromDate); // Sunday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    return endOfWeek;
  };
  const getCalenderData = async () => {
    let fromDate = selectedDate;
    let toDate = getToDate(fromDate);

    // Check if the selectedDate falls within the same week, and if so, keep fromDate the same
    const currentStartOfWeek = getStartOfWeek(new Date()); // Current week's start (Sunday)
    if (selectedDate >= currentStartOfWeek && selectedDate <= getToDate(currentStartOfWeek)) {
      fromDate = currentStartOfWeek;
    }

    const selectedDateDate = moment(selectedDate).format('MM/DD/YYYY');
    setLoader(true)
    console.log(`/ic/event/date-range?fromDate=${selectedDateDate}&toDate=${selectedDateDate}`, "from date to date==================>");
    const { res, err } = await httpRequest({
      method: 'get',
      navigation: navigation,
      path: `/ic/event/date-range?fromDate=${selectedDateDate}&toDate=${selectedDateDate}`,
    });

    if (res) {
      console.log(res, "====>");
      setLoader(false)

      setCalenderData(res?.data);
    } else {
      setLoader(false)

      setCalenderData([]);
      console.log("err", err);
    }
  }

  useEffect(() => {
    getCalenderData()
  }, [selectedDate])



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



  const handleSwipe = (direction) => {
    if (direction === 'left') {
      setWeekOffset((prev) => prev + 1);
    } else {
      setWeekOffset((prev) => prev - 1);
    }
  };

  // ===================>animation code here <====================

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
      <View style={{ backgroundColor: COLORS?.whiteColors }}>
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
        {loader ? <Loader /> : calenderData?.length > 0 ?
          <FlatList
            showsVerticalScrollIndicator={false}
            data={calenderData}
            keyExtractor={(item) => item.matterId}
            renderItem={({ item }) => (
              <>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View>
                    <Image
                      source={IconUri?.CalenderColor}
                      style={{ height: 20, width: 20, resizeMode: "contain", top: getResponsiveHeight(3) }}
                    />
                  </View>
                  <View style={{ width: "100%" }}>
                    <View style={[styles.eventItem]}>
                      <View style={{ width: "65%" }}>
                        <MyText style={styles.timeColor}>
                          {moment(item.eventScheduleDTOList[0]?.startOnTime).format('hh:mm A')} - {moment(item.eventScheduleDTOList[0]?.endOnTime).format('hh:mm A')}
                        </MyText>
                        <MyText style={[styles.txtStyle, { fontWeight: '300' }]}>
                          {item.title}
                        </MyText>
                        {item?.description && <MyText style={[styles.timeColor, { width: '70%' }]}>{item?.description}</MyText>}
                      </View>
                      <View style={{ width: "35%" }}>
                        {item?.location && <MyText
                          style={[
                            styles.timeColor,
                            { fontWeight: '300', },
                          ]}
                        >
                          {item?.location}
                        </MyText>}

                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getCalenderData} />
            }
          />
          :
          <>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Calender} style={{ height: 30, width: 30, resizeMode: "contain" }} />
              <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
            </View>
          </>}
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
    color: COLORS?.PRIMARY_COLOR,
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
