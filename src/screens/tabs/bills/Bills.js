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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import moment from 'moment';
import TimekeeperModal from '../../../components/TimekeeperModal';
import LinearGradient from 'react-native-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';

const Bills = ({ navigation, route }) => {
  const matterDetails = route?.params?.matterDetails

  const [tabs, setTabs] = React.useState('All');
  const [modalVisible, setModalVisible] = useState(false);

  const tabList = ['All', 'Unpaid', 'Paid', 'Partal Paid', 'Cancelled',];

  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [filteredData, setFilteredData] = useState([]);
  const getBills = async () => {
    const { res, err } = await httpRequest({
      method: 'get',
      path: `/ic/matter/bill/${matterDetails?.matterId ? `mat/${matterDetails?.matterId} ` : ''}`,
      navigation: navigation,
    })
    if (res) {
      console.log(res, "===============dd=d=d==============>");
      setFilteredData(res?.data);

      setData(res?.data)
    }
    else {
      console.log("err=================", err);
    }
  }

  useEffect(() => {
    getBills()
  }, [])

  // ✅ Search logic
  useEffect(() => {
    let filtered = [...data];

    // Filter based on tab
    if (tabs !== 'All') {
      filtered = filtered.filter(item => item.status?.toLowerCase() === tabs.toLowerCase());
    }

    // Filter based on search
    if (searchText !== '') {
      filtered = filtered.filter(item =>
        (item?.code + item?.matterName)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [searchText, data, tabs]);

  const handleDeleteItem = async (item) => {
    const { res, err } = await httpRequest({
      method: 'delete',
      path: `/ic/matter/bill/${item._id}`,
      navigation: navigation,
    })
    if (res) {
      getBills()
    }
    else {
      console.log("err=================", err);
    }
  }

  const renderDueStatus = (dueDate) => {
    const today = moment();
    const due = moment(dueDate);
    const diff = due.diff(today, 'days');

    if (diff > 0) {
      return `Due in ${diff} days`;
    } else if (diff === 0) {
      return 'Due today';
    } else {
      return `Overdue ${Math.abs(diff)} days ago`;
    }
  };

  const renderBillItem = ({ item }) => {
    console.log(item, "ITE<=======================>");

    return (
      <Swipeable
        renderLeftActions={() => renderLeftActions(item)}
        renderRightActions={() => renderRightActions(item)}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('MatterDetails', { matterData: item })}
          activeOpacity={0.9}
          style={styles.card}
        >
          {/* Row 1: Matter Name & Status */}
          <View style={styles.headerRow}>
            <MyText style={styles.codeText} numberOfLines={1}>
              {item?.matterName}
            </MyText>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item?.status === 'PAID' ? COLORS?.COMPLETE_BG : '#FBF2D2'
              }]}>
              <MyText
                style={[
                  styles.statusText,
                  {
                    color:
                      item?.status === 'PAID'
                        ? COLORS?.COMPLETD_TXT
                        : '#000000ff'
                  }
                ]}
              >
                {item?.status}
              </MyText>
            </View>
          </View>

          {/* Row 2: Code */}
          <MyText style={styles.mainText}>{item?.code}</MyText>

          {/* Row 3: Date */}
          <View style={styles.dateRow}>
            <MyText
              style={{
                ...styles.dateText,
                color: renderDueStatus(item?.dueDate).includes('Overdue') ? 'red' : '#444'
              }}
            >
              {renderDueStatus(item?.dueDate)}
            </MyText>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const renderLeftActions = (item) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("EditBilling", { billingDetails: item })}
      style={{
        backgroundColor: COLORS?.LIGHT_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 6,
      }}
    >
      <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
    </TouchableOpacity>
  );

  const renderRightActions = (item) => (
    <TouchableOpacity
      onPress={() => handleDeleteItem(item)}
      style={{
        backgroundColor: COLORS?.RED_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 6,
      }}
    >
      <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
    </TouchableOpacity>
  );


  return (
    <>
      <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Bills" />


      <Wrapper style={{ padding: 0 }}>
        {/* Search Row */}
        <View
          style={{
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SearchBar
            containerStyle={{ width: '90%' }}
            placeholder="Search Bills..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <Image
            source={IconUri?.event}
            style={{ height: 30, width: 30, resizeMode: 'contain' }}
          />
        </View>

        <View
          style={{ padding: 10, }}
        >
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
                        // opacity: tabs === item ? 1 : 0.5,
                        backgroundColor:
                          tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR
                        // backgroundColor:
                        //   COLORS.PRIMARY_COLOR
                      },
                    ]}
                    onPress={() => setTabs(item)}
                  >
                    <MyText
                      style={{

                        color: tabs === item ? COLORS.BLACK_COLOR : '#fff',
                        fontWeight: '600',
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
        {/* </LinearGradient> */}

        {/* Task List */}
        {filteredData?.length > 0 ? <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={renderBillItem}

          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={getBills} />
          }
        />
          :
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
            <Image tintColor={COLORS?.LIGHT_COLOR} source={IconUri?.bill} style={{ height: 50, width: 50, resizeMode: "contain" }} />
            <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS?.LIGHT_COLOR }}>No Data Found</MyText>
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

export default Bills;

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

  card: {
    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#ccc',
    marginHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    color: COLORS.PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: calculatefontSize(1.8),
    flex: 1,
  },
  mainText: {
    fontSize: calculatefontSize(1.7),
    fontWeight: '500',
    marginTop: 4,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dateText: {
    fontSize: calculatefontSize(1.3),
    color: '#444',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-end',
  },
  statusText: {
    fontSize: calculatefontSize(1.3),
    color: COLORS?.whiteColors,
  },
});
