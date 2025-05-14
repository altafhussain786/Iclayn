import { FlatList, Image, PanResponder, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import Wrapper from '../../../components/Wrapper';
import WelcomeContainer from './components/WelcomeContainer';
import MyText from '../../../components/MyText';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize, getResponsiveHeight } from '../../../helper/responsiveHelper';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const dispatch = useDispatch()

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

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




  const getCalenderData = async () => {



    // Check if the selectedDate falls within the same week, and if so, keep fromDate the same

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
            <MyText style={{ fontSize: calculatefontSize(2), color: COLORS?.PRIMARY_COLOR_LIGHT }}>
              {moment(selectedDate).isSame(moment(), 'day') ? "Today" : moment(selectedDate).format("MMM DD, YYYY")}
            </MyText>
            <TouchableOpacity onPress={() => setShowMonthPicker(true)}>
              <Image
                source={IconUri?.CalenderSearch}
                style={{ height: 25, width: 25, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          </View>
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
                          {/* <View style={[styles.draftBox, { backgroundColor: item?.userColor, height: 10, width: 10, }]}>
                </View> */}
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
                      {/* //Agendas */}

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
                  <View style={{ gap: 5, width: "70%" }}>
                    <MyText style={styles.timeColor}>Due 01-05-2025</MyText>
                    <MyText numberOfLines={2}
                      ellipsizeMode={'tail'} style={[styles.txtStyle, { fontWeight: '300', }]}>
                      {item?.name}
                    </MyText>
                    <MyText style={styles.timeColor}>{item?.matterName}</MyText>
                  </View>
                  <View style={{ gap: 5 }}>

                    <View
                      style={{
                        backgroundColor: item?.status === 'COMPLETED' ? COLORS?.GREEN_COLOR : '#ffc2cd',
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
                          color: item?.status === 'COMPLETED' ? COLORS?.whiteColors : '#6c0014',
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getTasks} />
            }
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
    color: COLORS.GREY_COLOR,
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
