import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

// Icons
import Entypo from 'react-native-vector-icons/Entypo';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import TimekeeperModal from '../../../components/TimekeeperModal';

const Tasks = ({ navigation }) => {
  const [tabs, setTabs] = React.useState('All');
    const [modalVisible, setModalVisible] = useState(false);

  const tabList = ['All', 'Pending', 'Completed'];

  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [filteredData, setFilteredData] = useState([]);
  const getTasks = async () => {
    const { res, err } = await httpRequest({
      method: 'get',
      path: `/ic/matter/task/`,
      navigation: navigation
    })
    if (res) {
      setFilteredData(res?.data);
      setData(res?.data)
    }
    else {
      console.log("err", err);
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  const checkBGStatusColor = (status) => {
    if (status.toLowerCase() === 'pending') {
      return COLORS?.PENDING_BG
    }
    else if (status.toLowerCase() === 'completed') {
      return COLORS?.COMPLETE_BG
    }
    else {
      return COLORS?.PENDING_BG
    }
  }
  const checkTxtStatusColor = (status) => {
    if (status.toLowerCase() === 'pending') {
      return COLORS?.PENDING_TXT
    }
    else if (status.toLowerCase() === 'completed') {
      return COLORS?.COMPLETD_TXT
    }
    else {
      return COLORS?.PENDING_TXT
    }
  }


  useEffect(() => {
    let filtered = [...data];

    // Filter based on tab
    if (tabs !== 'All') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === tabs.toLowerCase());
    }

    // Filter based on search
    if (searchText !== '') {
      filtered = filtered.filter(item =>
        (item?.name + item?.code + item?.matterName)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchText, data, tabs]);

  const renderLeftActions = () => {
    return (
      <View style={{ flexDirection: 'row', width: 200 }}> {/* <-- fixed width */}
        <TouchableOpacity
          onPress={() => console.log("Edit")}
          style={{ backgroundColor: '#0068D1', justifyContent: 'center', padding: 10, width: 100 }}
        >
          <Text style={{ color: COLORS?.whiteColors, textAlign: 'center', fontWeight: "bold" }}>
            Mark as{'\n'}Complete
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log("Delete")}
          style={{ backgroundColor: '#D0D9E0', justifyContent: 'center', padding: 10, width: 100 }}
        >
          <Text style={{ color: COLORS?.BLACK_COLOR, textAlign: 'center' }}>
            Update{'\n'}Status
          </Text>
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <>
      <ScreenHeader onPress={() => { navigation.navigate("Settings") }} isShowTitle={true} title="Tasks" />

      {/* Scrollable Tabs */}
      <View style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabList}

          renderItem={({ item, i }) => {
            return (
              <>
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.tab,

                    {
                      opacity: tabs === item ? 1 : 0.5,
                      backgroundColor:
                        COLORS.PRIMARY_COLOR
                    },
                  ]}
                  onPress={() => setTabs(item)}
                >
                  <MyText
                    style={{

                      color: '#fff',
                      fontWeight:'600',
                      fontSize: calculatefontSize(1.7),
                    }}
                    numberOfLines={1}
                  >
                    {item}
                  </MyText>
                </TouchableOpacity>
              </>
            )
          }}
        />
      </View>
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
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <Image
            source={IconUri?.CalenderSearch}
            style={{ height: 30, width: 30, resizeMode: 'contain' }}
          />
        </View>

        {/* Task List */}
        {filteredData?.length > 0 ? <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            return (
              <Swipeable renderLeftActions={renderLeftActions}>
                <View style={{ backgroundColor: '#fff' }}> {/* <-- needed so swipe action shows properly */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("TaskDetails", { item })}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                      borderBottomWidth: 1,
                      borderColor: COLORS?.BORDER_LIGHT_COLOR,
                      backgroundColor: '#fff',
                    }}
                  >
                    <View style={{ gap: 5, width: "65%" }}>
                      <MyText style={styles.timeColor}>{moment(item?.dueDate).fromNow()}</MyText>
                      <MyText numberOfLines={2} ellipsizeMode={'tail'} style={[styles.txtStyle, { fontWeight: '300' }]}>
                        {item?.name}
                      </MyText>
                      <MyText style={styles.timeColor}>{item?.matterName}</MyText>
                    </View>

                    <View style={{ gap: 5, width: "35%", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 10 }}>
                      <View
                        style={{
                          backgroundColor: checkBGStatusColor(item?.status),
                          borderRadius: 5,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                        }}
                      >
                        <MyText
                          style={{
                            color: checkTxtStatusColor(item?.status),
                            fontSize: calculatefontSize(1.4),
                          }}
                        >
                          {item?.status}
                        </MyText>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </Swipeable>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getTasks} />
          }
        />
          :
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
            <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Tasks} style={{ height: 30, width: 30, resizeMode: "contain" }} />
            <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
          </View>
        }

        {/* Floating Button */}
        

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
    </>
  );
};

export default Tasks;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
  },
  tab: {
    paddingVertical: 6,
    height: 30,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeColor: {
    color: COLORS?.GREY_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  txtStyle: {
    color: COLORS?.BLACK_COLOR,
    fontSize: calculatefontSize(1.9),
    fontWeight: '300',
  },
});
