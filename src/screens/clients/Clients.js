import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'

//Icons
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import Wrapper from '../../components/Wrapper';
import SearchBar from '../../components/SearchBar';
import FloatingButton from '../../components/FloatingButton';
import httpRequest from '../../api/apiHandler';
import Loader from '../../components/Loader';
import { formatNumber } from '../../helper/Helpers';
import TimekeeperModal from '../../components/TimekeeperModal';
import ScreenHeader from '../../components/ScreenHeader';
import { COLORS, IconUri } from '../../constants';
import { calculatefontSize, getResponsiveWidth } from '../../helper/responsiveHelper';
import MyText from '../../components/MyText';
import { Swipeable } from 'react-native-gesture-handler';
import { useToast } from 'react-native-toast-notifications';
import { useFocusEffect } from '@react-navigation/native';



const Clients = ({ navigation }) => {
  const [tabs, setTabs] = React.useState("Individual");
  const [activityData, setActivityData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [loader, setLoader] = React.useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const toast = useToast()



  const getActivityData = async () => {
    setLoader(true)
    const { res, err } = await httpRequest({
      method: 'get',
      navigation: navigation,
      path: `/ic/client/`
    })
    if (res) {
      console.log(res, "====>");
      setFilteredData(res?.data);
      setActivityData(res?.data);
      setLoader(false)
    }
    else {

      setActivityData([]);
      console.log("err", err);
      setLoader(false)

    }
  }


  useFocusEffect(
    useCallback(() => {
      getActivityData();
    }, [tabs]) // tabs bhi dependency me rakho
  );
  useEffect(() => {
    if (activityData.length > 0) {
      const filteredByType = activityData.filter(item => item?.type === tabs);
      setFilteredData(filteredByType);
    }
  }, [tabs, activityData]);

  useEffect(() => {
    let filtered = activityData.filter(item => item?.type === tabs);

    if (searchText !== '') {
      filtered = filtered.filter(item => {
        if (tabs === 'Individual') {
          const fullName = `${item?.firstName || ''} ${item?.lastName || ''}`.toLowerCase();
          return fullName.includes(searchText.toLowerCase());
        } else if (tabs === 'Company') {
          return (item?.companyName || '').toLowerCase().includes(searchText.toLowerCase());
        }
        return false;
      });
    }

    setFilteredData(filtered);
  }, [searchText, tabs, activityData]);
  const handleDeleteItem = async (item) => {
    console.log(item, "DEETE ITEM");

    const { res, err } = await httpRequest({
      method: 'delete',
      navigation: navigation,
      path: `/ic/client/`,
      params: [item?.clientId]
    })
    if (res) {
      toast.show('Client deleted successfully', { type: 'success' })
      getActivityData();
    }
    else {
      console.log("err", err);
    }
  }

  const renderClientItem = ({ item }) => {
    console.log(item, "item##########################################################");

    return (
      <Swipeable
        renderLeftActions={() => renderLeftActions(item)}
        renderRightActions={() => renderRightActions(item)}
        overshootLeft={false}
        overshootRight={false}
      >
        <TouchableOpacity activeOpacity={0.8} style={styles.card}>
          {/* Header Row: Name & Status */}
          <View style={styles.headerRow}>
            <MyText style={styles.codeText}>
              {item?.type === 'Company'
                ? item?.code + " " + item?.companyName
                : ` ${item?.code} ${item?.firstName || ''} ${item?.lastName || ''}`}
            </MyText>
            <View style={[styles.statusBadge, { backgroundColor: '#22C55E' }]}>
              <MyText style={styles.statusText}>{item?.status}</MyText>
            </View>
          </View>

          {/* Email */}
          {item?.clientEmailAddressDTOList?.[0]?.email && (
            <MyText style={styles.mainText}>
              {item?.clientEmailAddressDTOList[0]?.email}
            </MyText>
          )}

          {/* Date & Duration */}
          <View style={styles.dateRow}>
            <MyText style={styles.dateText}>
              {moment(item?.createdOn).format('DD/MM/YYYY')}
            </MyText>
          </View>
          <MyText style={styles.dueText}> {item?.clientAddresseDTOList?.length > 0 ? `${item?.clientAddresseDTOList[0]?.street || ''}, ${item?.clientAddresseDTOList[0]?.city || ''} ${item?.clientAddresseDTOList[0]?.state || ''}, ${item?.clientAddresseDTOList[0]?.country || ''}, ${item?.clientAddresseDTOList[0]?.postCode || ''}` : `Company Number: ${item?.companyNumber}` || ''}</MyText>
        </TouchableOpacity>
      </Swipeable>
    );
  };


  const renderLeftActions = (item) => (

    <TouchableOpacity onPress={() => navigation.navigate("EditClient", { clientData: item })} style={styles.leftSwipe}>
      <AntDesign name="edit" size={20} color={COLORS?.BLACK_COLOR} />
    </TouchableOpacity>

  );
  const renderRightActions = (item) => (
    <TouchableOpacity onPress={() => handleDeleteItem(item)} style={[styles.leftSwipe, { backgroundColor: COLORS?.RED_COLOR, marginLeft: 10, }]}>
      <AntDesign name="delete" size={20} color={COLORS?.whiteColors} />
    </TouchableOpacity>

  );
  return (
    <>

      <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title='Clients' />
      <LinearGradient
        colors={[COLORS?.PRIMARY_COLOR, COLORS?.PRIMARY_COLOR_LIGHT,]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.tabContainer}

      >
        {/* <View > */}
        {["Individual", "Company"].map((item) => (

          <TouchableOpacity
            key={item}
            style={[
              styles.tab,
              {
                borderBottomWidth: tabs === item ? 3 : 0,
                borderColor: tabs === item ? COLORS.PRIMARY_COLOR_LIGHT : "transparent",
                backgroundColor:
                  tabs === item ? COLORS.yellow : COLORS.PRIMARY_COLOR,
              },
            ]}
            onPress={() => setTabs(item)}
          >
            {/* {tabs === item && <Image source={IconUri?.checkmark} style={{ height: 20, width: 20, resizeMode: "contain", right: 10 }} />} */}
            <MyText style={{ color: tabs === item ? COLORS?.BLACK_COLOR : COLORS?.whiteColors, fontSize: calculatefontSize(2) }}>{item}</MyText>
          </TouchableOpacity>
        ))}
        {/* </View> */}
      </LinearGradient>
      <Wrapper style={{ padding: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <SearchBar
            containerStyle={{ width: "90%" }}

            placeholder="Search a client..."
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <Image
            source={IconUri?.Calender}
            style={{ height: 30, width: 30, resizeMode: "contain", bottom: 7 }}
          />
        </View>
        {/* ///RENDER ITEM =====================> */}
        {loader ? <Loader /> :

          filteredData?.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderClientItem}

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

export default Clients

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.PRIMARY_COLOR_LIGHT,
    // padding: 10,
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
  //FLAT ITEM
  timeColor: {
    color: COLORS?.LIGHT_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  txtStyle: {
    color: COLORS?.BLACK_COLOR,
    fontSize: calculatefontSize(1.9),
    fontWeight: '300',
  },
  taskText: {
    fontSize: 18,
    color: COLORS.PRIMARY_COLOR,
    textAlign: 'center',
    marginTop: 20,
  },
  // ==>
  card: {
    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
    padding: 15,
    marginVertical: 6,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#ccc',
    // marginHorizontal: 10
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  codeText: {
    color: COLORS.PRIMARY_COLOR,
    fontWeight: '600',
    fontSize: calculatefontSize(1.8)
  },
  mainText: {
    fontSize: calculatefontSize(1.7),
    fontWeight: '500',
    marginTop: 4
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  dateText: {
    fontSize: calculatefontSize(1.3),
    color: '#444'
  },
  dueText: {
    fontSize: calculatefontSize(1.3),
    color: '#444'
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-end'
  },
  statusText: {
    fontSize: calculatefontSize(1.3),
    color: COLORS?.whiteColors
  },
  leftSwipe: {
    backgroundColor: COLORS?.BORDER_LIGHT_COLOR,
    justifyContent: 'center',

    alignItems: 'flex-start',
    paddingHorizontal: 20,
    // marginHorizontal: 10,
    marginRight: 10,
    marginVertical: 6,
    // borderRadius: 8,
    // flex: 1,
  },
})