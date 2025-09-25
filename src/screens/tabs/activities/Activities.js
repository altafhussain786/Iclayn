import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ScreenHeader from '../../../components/ScreenHeader'
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize, getResponsiveWidth } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

//Icons
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import Loader from '../../../components/Loader';
import { formatNumber } from '../../../helper/Helpers';
import moment from 'moment';
import TimekeeperModal from '../../../components/TimekeeperModal';
import LinearGradient from 'react-native-linear-gradient';
import { Swipeable } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';

const Activities = ({ navigation, route }) => {
  const matterDetails = route?.params?.matterDetails
  const [tabs, setTabs] = React.useState("Time entries");
  const [activityData, setActivityData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [loader, setLoader] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const toast = useToast();

  console.log(matterDetails, "==========d============>matterDetails");


  const getActivityData = async () => {
    setLoader(true);
    let path = "";

    if (tabs === "Time entries") {
      path = `/ic/matter/time-entry/${matterDetails?.matterId ? `mat/${matterDetails?.matterId}` : ""}`;
    } else if (tabs === "Expenses") {
      path = `/ic/matter/exp-entry/${matterDetails?.matterId ? `mat/${matterDetails?.matterId}` : ""}`;
    } else if (tabs === "Award") {
      path = `/ic/matter/award/${matterDetails?.matterId ? `mat/${matterDetails?.matterId}` : ""}`;
    } else {
      // All ke liye agar combined API nahi hai to fallback
      path = `/ic/matter/time-entry/${matterDetails?.matterId ? `mat/${matterDetails?.matterId}` : ""}`;
    }

    const { res, err } = await httpRequest({
      method: "get",
      navigation,
      path,
    });

    if (res) {
      setFilteredData(res?.data || []);
      setActivityData(res?.data || []);
    } else {
      setActivityData([]);
      console.log("err", err);
    }
    setLoader(false);
  };

  useFocusEffect(
    useCallback(() => {
      getActivityData();
    }, [tabs]) // tabs bhi dependency me rakho
  );

  // useEffect(() => {
  //   getActivityData();
  // }, [tabs])


  useEffect(() => {
    if (searchText === '') {
      setFilteredData(activityData);
    } else {
      const filtered = activityData.filter(item =>
        (item?.matterName)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, activityData]);


  const handleDeleteItem = async (item) => {
    let path = "";
    let id = "";

    if (tabs === "Expenses") {
      path = "/ic/matter/exp-entry/";
      id = item?.matterExpenseEntryId;
    } else if (tabs === "Time entries") {
      path = "/ic/matter/time-entry/";
      id = item?.matterTimeEntryId;
    } else if (tabs === "Award") {
      path = "/ic/matter/award/";
      id = item?.matterAwardEntryId; // 👈 Award ka unique ID
    }

    const { res, err } = await httpRequest({
      method: "delete",
      navigation,
      path,
      params: [id],
    });

    if (res) {
      toast.show("Activity deleted successfully", { type: "success" });
      getActivityData();
    } else {
      console.log("err", err);
    }
  };
  const renderActivityItem = ({ item }) => {
    const isBilled = item?.billed;
    const entryType = item?.type;
    const amount = formatNumber(item?.amount);
    const duration = item?.duration;

    return (
      <Swipeable
        renderLeftActions={() => renderLeftActions(item)}
        renderRightActions={() => renderRightActions(item)}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
        >
          {/* Left content */}
          <View style={styles.cardLeft}>
            <MyText style={styles.dateText}>{moment(item?.entryDate).format("DD-MM-YYYY")}</MyText>
            <MyText style={styles.titleText} numberOfLines={1}>{item?.matterName || item?.module}</MyText>
            {entryType && <MyText style={styles.entryType}>{entryType}</MyText>}
            {item?.description && (
              <MyText style={styles.descText} numberOfLines={2}>{item?.description}</MyText>
            )}
          </View>

          {/* Right content */}
          <View style={styles.cardRight}>
            <MyText style={styles.amountText}>${amount}</MyText>
            {<MyText style={styles.durationText}>{duration || tabs}</MyText>}
            <View style={[
              styles.statusBox,
              { backgroundColor: isBilled ? "#22C55E" : "#ffc2cd" }
            ]}>
              <MyText style={[
                styles.statusText,
                { color: isBilled ? COLORS?.whiteColors : "#6c0014" }
              ]}>
                {isBilled ? "Billed" : "Unbilled"}
              </MyText>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };



  const renderLeftActions = (item) => {
    const handleNavigate = () => {
      if (item?.type === "RECOVERIES" || item?.type === "DISBURSEMENT") {
        navigation.navigate("EditExpense", { communicationDetails: item });
      } else if (item?.awardDate) {
        navigation.navigate("EditAward", { communicationDetails: item });
      } else {
        navigation.navigate("EditTimeEntry", { communicationDetails: item });
      }
    };

    return (
      <TouchableOpacity
        onPress={handleNavigate}
        style={{
          backgroundColor: COLORS?.LIGHT_COLOR,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          marginVertical: 6,
        }}
      >
        <AntDesign name="edit" size={20} color={COLORS?.whiteColors} />
      </TouchableOpacity>
    );
  };

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

      <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Activities' />
      <LinearGradient
        colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabContainer}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 10 }}
        >
          {["All", "Time entries", "Expenses", "Award"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.tab,
                tabs === item && styles.activeTab
              ]}
              onPress={() => setTabs(item)}
            >
              <MyText
                style={[
                  styles.tabText,
                  { color: tabs === item ? COLORS?.BLACK_COLOR : COLORS?.whiteColors }
                ]}
              >
                {item}
              </MyText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
      <Wrapper style={{ padding: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 }}>
          <SearchBar
            containerStyle={{ width: "90%" }}

            placeholder="Search a task"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <Image
            source={IconUri?.event}
            style={{ height: 30, width: 30, resizeMode: "contain" }}
          />
        </View>
        {/* ///RENDER ITEM =====================> */}
        {loader ? <Loader /> :

          filteredData?.length > 0 ?
            <FlatList
              // style={{ padding: 10 }}
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderActivityItem}

              ListFooterComponent={() => <View style={{ height: 100 }} />}
            />
            :
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Image source={IconUri?.Activitie} style={{ height: 30, width: 30, resizeMode: "contain" }} />
              <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
            </View>
        }
        {/* Floating Button */}
        <FloatingButton
          style={{ marginBottom: 40 }}
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
  )
}

export default Activities

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: getResponsiveWidth(6), // ✅ responsive width
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: COLORS?.PRIMARY_COLOR,
  },
  activeTab: {
    backgroundColor: COLORS?.yellow,
    borderBottomWidth: 3,
    borderColor: COLORS?.PRIMARY_COLOR_LIGHT,
  },
  tabText: {
    fontSize: calculatefontSize(1.8), // ✅ responsive font
    fontWeight: "500",
  },
  // =============>
  card: {
    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#ccc',
  },
  cardLeft: {
    width: '65%',
    gap: 5,
  },
  cardRight: {
    width: '35%',
    alignItems: 'flex-end',
    gap: 5,
    paddingHorizontal: 5,
  },
  dateText: {
    color: COLORS?.LIGHT_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  titleText: {
    color: COLORS?.BLACK_COLOR,
    fontSize: calculatefontSize(1.8),
    fontWeight: '500',
  },
  entryType: {
    color: COLORS?.GREY_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  descText: {
    color: COLORS?.GREY_COLOR,
    fontSize: calculatefontSize(1.4),
  },
  amountText: {
    fontWeight: '600',
    fontSize: calculatefontSize(1.6),
  },
  durationText: {
    fontSize: calculatefontSize(1.5),
  },
  statusBox: {
    marginTop: 4,
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 10,
  },
  statusText: {
    fontWeight: '500',
    fontSize: calculatefontSize(1.4),
  },

})