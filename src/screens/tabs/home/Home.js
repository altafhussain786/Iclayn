import { FlatList, Image, PanResponder, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import Wrapper from '../../../components/Wrapper';
import WelcomeContainer from './components/WelcomeContainer';
import MyText from '../../../components/MyText';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize, getResponsiveHeight } from '../../../helper/responsiveHelper';

//PKGS
import { CalendarList } from 'react-native-calendars';
//Icons
import Entypo from "react-native-vector-icons/Entypo";
import SearchBar from '../../../components/SearchBar';
import httpRequest from '../../../api/apiHandler';
import { adduserDetails } from '../../../store/slices/userDetails';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import Loader from '../../../components/Loader';

const Home = ({ navigation }) => {
  const [tabs, setTabs] = React.useState("Events");
  const [weekOffset, setWeekOffset] = useState(0);
  const dispatch = useDispatch()
  const flatListRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loader, setLoader] = useState(false);
  const [calenderData, setCalenderData] = useState([]);
  //search states here ========>
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //Task states here ================================>

  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
  const [taskLoader, setTaskLoader] = useState(false); // ✅ for refresh
  const [searchTask, setSearchTask] = useState(''); // ✅ for search
  const [filterTaskData, setFilterTaskData] = useState([]);
  const getTasks = async () => {
    setTaskLoader(true)
    const { res, err } = await httpRequest({
      method: 'get',
      path: `/ic/matter/task/`,
    })
    if (res) {
      setFilterTaskData(res?.data);
      setData(res?.data)
    setTaskLoader(false)

    }
    else {
    setTaskLoader(false)

      console.log("err", err);
    }
  }

  useEffect(() => {
    if (tabs === "Tasks") {
      getTasks()
    }
  }, [tabs])
  useEffect(() => {
    if (searchTask.trim() === '') {
      setFilterTaskData(data);
    } else {
      const filtered = data.filter(item =>
        item.matterName?.toLowerCase().includes(searchTask.toLowerCase())
      );
      setFilterTaskData(filtered);
    }
  }, [searchTask, calenderData]);
  // ===================================================================>

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toDateString().slice(0, 3),
      num: date.getDate(),
    };
  });

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
    console.log("hellfo");
    setLoader(true)
    console.log(`/ic/event/date-range?fromDate=${selectedDateDate}&toDate=${selectedDateDate}`, "from date to date===d===============>");
    const { res, err } = await httpRequest({
      method: 'get',
      path: `/ic/event/date-range?fromDate=${selectedDateDate}&toDate=${selectedDateDate}`,
    });

    if (res) {

      setLoader(false)
      setFilteredData(res?.data);
      setCalenderData(res?.data);
    } else {
      setLoader(false)
      setFilteredData([]);

      setCalenderData([]);
      console.log("err", err);
    }
  }




  useEffect(() => {
    getCalenderData()
  }, [selectedDate])


  const getUserData = async () => {

    const { res, err } = await httpRequest(
      {
        method: 'post',
        path: `/ic/auth/authorize`,
        params: {}
      }
    )
    if (res) {
      console.log(res, "resdddddd sdata=====dddddddddd=====");

      dispatch(adduserDetails(res?.data))

    }
    else {
      console.log("errd", err);

    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  useEffect(() => {
    setSelectedDate(currentWeek[3].date); // always center select (Thursday)
  }, [weekOffset]);

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
  const currentWeek = getWeekDays(
    new Date(new Date().setDate(new Date().getDate() + weekOffset * 7))
  );

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

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredData(calenderData);
    } else {
      const filtered = calenderData.filter(item =>
        item.title?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, calenderData]);

  return (
    <>
      <ScreenHeader onPress={() => { navigation.navigate("Settings") }} />
      <WelcomeContainer />

      {/* Tabs */}
      <View style={styles.tabContainer1}>
        {["Events", "Tasks"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.tab,
              {
                borderBottomWidth: tabs === item ? 3 : 0,
                borderColor: tabs === item ? COLORS.PRIMARY_COLOR : "transparent",
                backgroundColor:
                  tabs === item ? COLORS.PRIMARY_COLOR_LIGHT : COLORS.PRIMARY_COLOR_LIGHT,
              },
            ]}
            onPress={() => setTabs(item)}
          >
            {tabs === item && <Entypo name={'check'} size={20} color={tabs === item ? "#fff" : "#000"} />}
            <MyText style={{ color: tabs === item ? COLORS?.whiteColors : COLORS?.whiteColors, fontSize: calculatefontSize(2) }}>{item}</MyText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {tabs === "Events" ? (
        <Wrapper>
          <SearchBar
            placeholder='Search an event'
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
            <MyText style={{ fontSize: calculatefontSize(2), color: COLORS?.PRIMARY_COLOR_LIGHT }}>Today</MyText>
            <Image
              source={IconUri?.CalenderSearch}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
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
                  {...panResponder.panHandlers}
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

          {loader ? <Loader /> : filteredData?.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyExtractor={(item) => item.title}
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
                      <View style={styles.eventItem}>
                        <View>
                          <MyText style={styles.timeColor}>
                            {moment(item.eventScheduleDTOList[0]?.startOnTime).format('hh:mm A')} - {moment(item.eventScheduleDTOList[0]?.endOnTime).format('hh:mm A')}
                          </MyText>
                          <MyText style={[styles.txtStyle, { fontWeight: '300' }]}>
                            {item.title}
                          </MyText>
                          {item?.description && <MyText style={[styles.timeColor, { width: '70%' }]}>{item?.description}</MyText>}
                        </View>
                        <View>
                          {/* <View style={[styles.draftBox, { backgroundColor: item?.userColor, height: 10, width: 10, }]}>
                </View> */}
                          {item?.location && <MyText
                            style={[
                              styles.timeColor,
                              { fontWeight: '600', textAlign: 'right' },
                            ]}
                          >
                            {item?.location}
                          </MyText>}

                        </View>
                      </View>
                      {/* //Agendas */}
                      {
                        item?.eventScheduleDTOList?.length > 0 &&
                        item?.eventScheduleDTOList?.map((schedule, index) => (
                          <>
                            <View style={{ left: 30, borderWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR, padding: 10, width: '90%' }}>
                              <MyText style={{ fontSize: calculatefontSize(1.5), color: "gray" }}>{moment(schedule?.startOnDate).format('MM/DD/YYYY')} - {moment(schedule?.endOnDate).format('MM/DD/YYYY')}</MyText>
                              <MyText style={{ fontSize: calculatefontSize(1.5), color: "gray" }}>{moment(schedule?.startOnTime).format('hh:mm A')} - {moment(schedule?.endOnTime).format('hh:mm A')}</MyText>

                            </View>
                          </>
                        ))
                      }
                    </View>
                  </View>
                </>
              )}
            />
            :
            <>
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
                <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Calender} style={{ height: 30, width: 30, resizeMode: "contain" }} />
                <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
              </View>
            </>}
        </Wrapper>
      ) : (
        <Wrapper>
          {/* Search Row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <SearchBar
              containerStyle={{ width: '90%' }}
              placeholder="Search a task"
              value={searchTask}
              onChangeText={text => setSearchTask(text)}
            />
            <Image
              source={IconUri?.CalenderSearch}
              style={{ height: 25, width: 25, resizeMode: 'contain' }}
            />
          </View>

          {/* Task List */}
          {taskLoader ? <Loader /> : filterTaskData?.length > 0 ? <FlatList
            showsVerticalScrollIndicator={false}
            data={filterTaskData}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item, index }) => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 10,
                    borderBottomWidth: 1,
                    paddingVertical: 15,
                    borderColor: COLORS?.BORDER_LIGHT_COLOR,
                  }}
                >
                  <View style={{ gap: 5 }}>
                    <MyText style={styles.timeColor}>Due 01-05-2025</MyText>
                    <MyText style={[styles.txtStyle, { fontWeight: '300', width: '70%' }]}>
                      {item?.code} - {item?.name}
                    </MyText>
                    <MyText style={styles.timeColor}>{item?.matterName}</MyText>
                  </View>
                  <View style={{ gap: 5 }}>

                    <View
                      style={{
                        backgroundColor: '#ffc2cd',
                        alignSelf: 'flex-end',
                        borderRadius: 5,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <MyText
                        style={{
                          fontWeight: '600',
                          textAlign: 'center',
                          color: '#6c0014',
                          fontSize: calculatefontSize(1.4),
                        }}
                      >
                        {item?.status}
                      </MyText>
                    </View>
                  </View>
                </View>
              );
            }}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={getTasks} />
          // }
          />
            :
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Tasks} style={{ height: 30, width: 30, resizeMode: "contain" }} />
              <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Task Found</MyText>
            </View>
          }
        </Wrapper>
      )}
    </>
  );
};

export default Home;

const styles = StyleSheet.create({

  tabContainer1: {

    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
    // padding: 10,
  },
  tabContainer: {

    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.PRIMARY_COLOR,
    // padding: 10,
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
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",

    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
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
  taskText: {
    fontSize: 18,
    color: COLORS.PRIMARY_COLOR,
    // textAlign: 'center',
    marginTop: 20,
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
});
