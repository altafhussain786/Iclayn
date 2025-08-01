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

const Tasks = ({ navigation }) => {
  const [tabs, setTabs] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const tabList = ['All', 'Pending', 'Completed'];
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
      path: `/ic/matter/task/`,
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
    if (searchText !== '') {
      filtered = filtered.filter(item =>
        (item?.name + item?.code + item?.matterName).toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredData(filtered);
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
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => handleDeleteItem(item)}
        style={{ backgroundColor: COLORS?.RED_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
      >
        <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
      </TouchableOpacity>
    </View>
  );
  const renderLeftActions = (item) => (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EditTask", { defaultData: item })}
        style={{ backgroundColor: COLORS?.LIGHT_COLOR, justifyContent: 'center', padding: 10, width: 100, alignItems: "center" }}
      >
        <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
      </TouchableOpacity>
    </View>
  );

  const visibleData = filteredData.slice(0, limit);

  const renderItem = ({ item }) => {
    const isVisible = viewableItems.includes(item._id);
    const TaskContent = (
      <Swipeable renderLeftActions={() => renderLeftActions(item)} renderRightActions={() => renderRightActions(item)}>
        <View style={{ backgroundColor: '#fff' }}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate("TaskDetails", { item })}
            style={styles.taskRow}
          >
            <View style={{ gap: 5, width: "65%" }}>
              <MyText style={styles.timeColor}>{item?.code}</MyText>
              <MyText numberOfLines={2} ellipsizeMode={'tail'} style={[styles.txtStyle, { fontWeight: '300' }]}> {item?.name} </MyText>
              <MyText style={styles.timeColor}>{item?.matterName}</MyText>
            </View>
            <View style={styles.statusBox}>
              <View style={{ backgroundColor: checkBGStatusColor(item?.status), borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2 }}>
                <MyText style={{ color: checkTxtStatusColor(item?.status), fontSize: calculatefontSize(1.4) }}>{item?.status}</MyText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
    return isVisible ? (
      { TaskContent }
    ) : TaskContent;
  };

  return (
    <>
      <ScreenHeader onPress={() => navigation.navigate("Settings")} isShowTitle={true} title="Tasks" />

      <LinearGradient colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ padding: 10 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={tabList}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item}
              style={[styles.tab, { opacity: tabs === item ? 1 : 0.5, backgroundColor: COLORS.PRIMARY_COLOR }]}
              onPress={() => setTabs(item)}
            >
              <MyText style={{ color: '#fff', fontWeight: '600', fontSize: calculatefontSize(1.7) }}>{item}</MyText>
            </TouchableOpacity>
          )}
        />
      </LinearGradient>

      <Wrapper>
        <View style={styles.searchRow}>
          <SearchBar containerStyle={{ width: '90%' }} placeholder="Search a task" value={searchText} onChangeText={text => setSearchText(text)} />
          <Image source={IconUri?.CalenderSearch} style={{ height: 30, width: 30, resizeMode: 'contain' }} />
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
  }
});
