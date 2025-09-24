import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import moment from 'moment';
import { Swipeable } from 'react-native-gesture-handler';
import TimekeeperModal from '../../../components/TimekeeperModal';
import LinearGradient from 'react-native-linear-gradient';
import Loader from '../../../components/Loader';
import { useToast } from 'react-native-toast-notifications';

const Tasks = ({ navigation, route }) => {
  const matterDetails = route?.params?.matterDetails
  const [tabs, setTabs] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const tabList = ['All', 'Pending', 'Completed', 'Required', 'Not Required'];
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [limit, setLimit] = useState(20);
  const [viewableItems, setViewableItems] = useState([]);
  const onViewRef = useRef(({ viewableItems: vItems }) => {
    setViewableItems(vItems.map(({ item }) => item._id));
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const toast = useToast()
  const getTasks = async () => {
    setLoader(true);
    const { res, err } = await httpRequest({
      method: 'get',
      path: `/ic/matter${matterDetails?.matterId ? `/${matterDetails?.matterId} ` : ''}/task/`,
      navigation,
    });
    if (res) {
      setFilteredData(res?.data);
      setData(res?.data);
      setLoader(false);

    } else {
      setLoader(false);

      console.log('err', err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  const checkBGStatusColor = (status) => {
    if (status.toLowerCase() === 'pending') return COLORS?.PENDING_BG;
    if (status.toLowerCase() === 'completed') return COLORS?.COMPLETE_BG;
    return COLORS?.PENDING_BG;
  };

  const checkTxtStatusColor = (status) => {
    if (status.toLowerCase() === 'pending') return COLORS?.PENDING_TXT;
    if (status.toLowerCase() === 'completed') return COLORS?.COMPLETD_TXT;
    return COLORS?.PENDING_TXT;
  };

  useEffect(() => {
    let filtered = [...data];
    if (tabs !== 'All') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === tabs.toLowerCase());
    }
    if (tabs === 'Pending') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === 'pending');

    }
    if (tabs === 'Completed') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === 'completed');

    }
    if (tabs === 'Required') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === 'required');

    }
    if (tabs === 'Required' || tabs === 'Not Required') {

      filtered = data.filter(item => item.required === (tabs === 'Required'));
    }
    // if (tabs === 'Not Required') {
    //   filtered = filtered.filter(item => item.required == true);

    // }
    // if (tabs === 'Not Required') {
    //   filtered = filtered.filter(item => item.required == false);

    // }
    if (searchText !== '') {
      filtered = filtered.filter(item =>
        (item?.name + item?.code + item?.matterName).toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredData(filtered.sort((a, b) => new Date(b.openDate) - new Date(a.openDate)));
    // setFilteredData(filtered);
  }, [searchText, data, tabs]);

  const handleDeleteItem = async (item) => {

    const { res, err } = await httpRequest({
      method: 'delete',
      path: `/ic/matter/task/`,
      params: [item?.taskId],
      navigation,
    });
    if (res) {
      toast.show('Task deleted successfully', { type: 'success' })
      getTasks();
    } else {
      console.log('err', err);
    }
  };

  const renderRightActions = (item) => (
    <TouchableOpacity onPress={() => handleDeleteItem(item)} style={[styles.leftSwipe, { backgroundColor: COLORS?.RED_COLOR }]}>
      <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
    </TouchableOpacity>

  );
  const renderLeftActions = (item) => (

    <TouchableOpacity onPress={() => navigation.navigate("EditTask", { defaultData: item })} style={styles.leftSwipe}>
      <AntDesign name="edit" size={20} color={COLORS?.BLACK_COLOR} />
    </TouchableOpacity>


  );

  const visibleData = filteredData.slice(0, limit);


  const renderItem = ({ item }) => {
    const isVisible = viewableItems.includes(item._id);

    const TaskContent = (
      <Swipeable
        renderLeftActions={() => renderLeftActions(item)}
        renderRightActions={() => renderRightActions(item)}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate("TaskDetails", { item })}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 5,
            marginVertical: 6,
            padding: 15,

            borderWidth: 0.5,
            borderColor: COLORS?.BORDER_LIGHT_COLOR,
            borderRadius: 10,
            backgroundColor: COLORS?.BORDER_LIGHT_COLOR,

          }}
        >
          {/* Left Side */}
          <View style={{ width: '65%', gap: 5 }}>
            <MyText style={{ color: COLORS.GREY_COLOR, fontSize: calculatefontSize(1.5) }}>
              {item?.code}
            </MyText>

            <MyText
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{
                fontSize: calculatefontSize(2),
                fontWeight: '500',
                color: COLORS.BLACK_COLOR,
              }}
            >
              {item?.name}
            </MyText>

            <MyText
              numberOfLines={1}
              style={{ fontSize: calculatefontSize(1.5), color: COLORS.GREY_COLOR }}
            >
              {item?.matterName}
            </MyText>
          </View>

          {/* Right Side (Status Badge) */}
          <View style={{ width: '35%', alignItems: 'flex-end' }}>
            <View
              style={{
                backgroundColor: checkBGStatusColor(item?.status),
                borderColor: checkTxtStatusColor(item?.status),
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <MyText
                style={{
                  fontSize: calculatefontSize(1.4),
                  fontWeight: '500',
                  color: checkTxtStatusColor(item?.status),
                }}
              >
                {item?.status}
              </MyText>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );

    return isVisible ? TaskContent : TaskContent;
  };


  return (
    <>
      <ScreenHeader isGoBack={matterDetails ? true : false} onPress={() => matterDetails ? navigation.goBack() : navigation.navigate("Settings")} isShowTitle={true} title="Tasks" />

      <LinearGradient colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: 10 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabList}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item}
              style={[styles.tab,
              {
                // opacity: tabs === item ? 1 : 0.5,
                backgroundColor:
                  tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR
                // backgroundColor: COLORS.PRIMARY_COLOR
              }
              ]}
              onPress={() => setTabs(item)}
            >
              <MyText style={{ color: tabs === item ? COLORS?.BLACK_COLOR : '#fff', fontWeight: '600', fontSize: calculatefontSize(1.7) }}>{item}</MyText>
            </TouchableOpacity>
          )}
        />
      </LinearGradient>

      <Wrapper style={{ padding: 0 }}>
        <View style={[styles.searchRow, { padding: 10 }]}>
          <SearchBar containerStyle={{ width: '90%' }} placeholder="Search a task" value={searchText} onChangeText={text => setSearchText(text)} />
          <Image source={IconUri?.Calender} style={{ height: 30, width: 30, resizeMode: 'contain', bottom: 7 }} />
        </View>

        {
          loader ? <Loader /> :
            filteredData.length > 0 ? (
              <FlatList
                data={visibleData}
                keyExtractor={item => item._id?.toString() || Math.random().toString()}
                renderItem={renderItem}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={7}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getTasks} />}
                onViewableItemsChanged={onViewRef.current}
                viewabilityConfig={viewConfigRef.current}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (limit < filteredData.length) setLimit(prev => prev + 20);
                }}
              />
            ) : (
              <View style={styles.noDataView}>
                <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Tasks} style={{ height: 30, width: 30, resizeMode: "contain" }} />
                <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
              </View>
            )}

        <FloatingButton onPress={() => setModalVisible(true)} icon="plus" navigateTo="CreateScreen" backgroundColor={COLORS.PRIMARY_COLOR_LIGHT} size={50} iconSize={25} />
        <TimekeeperModal navigation={navigation} visible={modalVisible} onClose={() => setModalVisible(false)} />
      </Wrapper>
    </>
  );
};

export default Tasks;

const styles = StyleSheet.create({
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
  statusBox: {
    width: "35%",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 10
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: COLORS?.BORDER_LIGHT_COLOR,
    backgroundColor: '#fff',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noDataView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  },
  leftSwipe: {
    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
    justifyContent: 'center',

    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginVertical: 6,
    // borderRadius: 8,
    // flex: 1,
  },
});
