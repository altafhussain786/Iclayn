import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import { formatNumber } from '../../../helper/Helpers';
import moment from 'moment';

const Bills = ({ navigation }) => {
  const [tabs, setTabs] = React.useState('Upcoming');

  const tabList = ['Upcoming', 'Overdue', 'No due date', 'Completed', 'Archived', 'Delegated'];
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [filteredData, setFilteredData] = useState([]);
  const [clients, setClients] = useState([]);


  const getBills = async () => {
    try {
      const [billRes, clientRes, matterBill] = await Promise.all([
        httpRequest({ method: 'get', path: `/ic/matter/client-fund/` }),
        httpRequest({ method: 'get', path: `/ic/client/` }), // Replace with actual client endpoint
        httpRequest({ method: 'get', path: `/ic/matter/bill/` }), // Replace with actual client endpoint
      ]);

      console.log(billRes, "BILL RESPO");
      console.log(clientRes, "clientRes RESPO");
      console.log(matterBill, "Matter bill RESPOd");

      if (billRes?.res && clientRes?.res && matterBill?.res) {
        const clientList = clientRes.res.data;

        // Transform bill data
        const mappedBillData = billRes.res.data.map(bill => {
          const client = clientList.find(c => c.clientId?.toString() === bill.clientIds);
          return {
            ...bill,
            clientName: client?.firstName + ' ' + client?.lastName || 'Unknown',
            type: "Client Funds"
          };
        });

        // Transform matter bill data to match keys
        const transformedMatterBillData = matterBill.res.data.map(m => {


          const client = clientList.find(c => c.clientId?.toString() === m.clientIds);
          return {
            ...m,
            clientName: (m?.toFirstName + ' ' + m?.toLastName) || (client?.firstName + ' ' + client?.lastName) || 'Unknown',
            issueDate: m.issueDate || m.createdAt || new Date(),
            dueDate: m.dueDate || new Date(),
            amount: m.amount || 0,
            status: m.status || 'Pending',
            type: "Bill"

          };
        });

        const mergedData = [...mappedBillData, ...transformedMatterBillData];

        setData(mergedData);
        setFilteredData(mergedData);
      }
    } catch (err) {
      console.log('Fetching error:', err);
    }
  };

  useEffect(() => {
    getBills()
  }, [])

  // ✅ Search logic
  useEffect(() => {
    if (searchText === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        (item?.name + item?.code + item?.fromName)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, data]);


  return (
    <>
      <ScreenHeader onPress={() => { navigation.navigate("Settings") }} isShowTitle={true} title="Bills" />

      {/* Scrollable Tabs */}
      <View style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, opacity: 0.8, backgroundColor: COLORS?.PRIMARY_COLOR, borderRadius: 10 }}>
          <MyText style={{ color: COLORS?.whiteColors, fontWeight: '400', fontSize: calculatefontSize(1.9) }}>All matters</MyText>
          <AntDesign name={'down'} size={20} color={COLORS?.whiteColors} />
        </View>
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
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />
        </View>

        {/* Task List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
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
                  <MyText style={styles.timeColor}>Issue {moment(item?.issueDate).format('DD-MM-YYYY')}</MyText>
                  <MyText style={[styles.txtStyle, { fontWeight: '600' }]}>
                    {item?.clientName} - {item?.type}
                  </MyText>
                  <MyText style={[styles.timeColor,]}>Overdue {moment(item?.dueDate).fromNow()}</MyText>
                </View>
                <View style={{ gap: 5 }}>
                  <MyText style={[styles.txtStyle, { fontWeight: '600', textAlign: 'right' }]}>
                    {formatNumber(item?.amount)}
                  </MyText>                  <View
                    style={{
                      backgroundColor: item?.status === 'PENDING' ? COLORS?.PRIMARY_COLOR : '#ffc2cd',
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
                        color: item?.status === 'PENDING' ? COLORS?.whiteColors : '#6c0014',
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
            <RefreshControl refreshing={refreshing} onRefresh={getBills} />
          }
        />

        {/* Floating Button */}
        <FloatingButton
          icon="plus"
          navigateTo="CreateScreen"
          backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
          size={50}
          iconSize={25}
        />
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
    color: COLORS?.LIGHT_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  txtStyle: {
    color: COLORS?.BLACK_COLOR,
    fontSize: calculatefontSize(1.9),
    fontWeight: '300',
  },
});
