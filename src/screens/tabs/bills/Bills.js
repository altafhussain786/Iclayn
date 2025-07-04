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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import { formatNumber } from '../../../helper/Helpers';
import moment from 'moment';
import { useToast } from 'react-native-toast-notifications';
import Loader from '../../../components/Loader';
import TimekeeperModal from '../../../components/TimekeeperModal';

const Bills = ({ navigation }) => {
  const [tabs, setTabs] = React.useState('Upcoming');

  const tabList = ['Upcoming', 'Overdue', 'No due date', 'Completed', 'Archived', 'Delegated'];
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false); // ✅ for refresh
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [filteredData, setFilteredData] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
      const [modalVisible, setModalVisible] = useState(false);
  
  const toast = useToast();

  const [clientsStates, setClientsStates] = useState({
    loader: false,
    allClients: [],
  });
  const fetchClients = async () => {
    setClientsStates(prev => ({ ...prev, loader: true }));

    const { res, err } = await httpRequest({ path: "/ic/client/", method: "get", navigation: navigation, });
    if (res) {
      const data = res?.data?.map(v => ({
        label: v.companyName || `${v?.firstName} ${v?.lastName}`,
        value: v?.clientId,
      }));
      setClientsStates(prev => ({ ...prev, allClients: data }));
    } else {
      toast.show(err?.message, { type: 'danger' })
    }
    setClientsStates(prev => ({ ...prev, loader: false }));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchBills = async () => {
    setIsLoader(true);
    try {
      let newRecords = [];
      // Fetch bill data
      const billResponse = await httpRequest({
        path: "/ic/matter/bill/",
        method: "get",
        navigation: navigation,
      });
      if (billResponse.res) {
        const billData = billResponse.res.data.map(v => ({
          id: v.matterBillId,
          issueDate: v.createdOn,
          type: "Bill",
          status: v.status,
          dueDate: v.dueDate,
          clientName: v.toFirstName + " " + v.toLastName,
          paymentDate: v.paymentDate,
          balance: v.balance,
          clientIds: null,
        }));
        newRecords = [...newRecords, ...billData];
      }
      // Fetch funds data
      const fundsResponse = await httpRequest({
        path: "/ic/matter/client-fund/",
        method: "get",
        navigation: navigation,
      });
      if (fundsResponse.res) {
        const fundsData = fundsResponse.res.data.map(v => {
          const clientName = clientsStates.allClients
            .filter(client => (v.clientIds || "").split(",").includes(String(client.value)))
            .map(v => v.label)
            .join(", ");
          return {
            id: v.matterClientFundId,
            issueDate: v.createdOn,
            type: "Client Funds",
            status: v.status,
            dueDate: v.dueDate,
            clientName: clientName,
            paymentDate: null,
            balance: String(v.amount) || null,
            clientIds: v.clientIds,
          };
        });
        newRecords = [...newRecords, ...fundsData];
      }
      if (newRecords.length > 0) {
        setFilteredData(newRecords);
        setData(newRecords);
        setIsLoader(false);


      }
      // Show errors if any

      if (billResponse.err) toast.show(billResponse.err, { type: 'danger' });
      if (fundsResponse.err) toast.show(fundsResponse.er, { type: 'danger' });
    } catch (error) {
      toast.show("Failed to fetch bildls", { type: 'danger' })
    } finally {
      setIsLoader(false);
    }
  };
  useEffect(() => {

    // setData([]);
    fetchBills();
  }, [clientsStates]);
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
          console.log();

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

  // useEffect(() => {
  //   getBills()
  // }, [])

  // ✅ Search logic
  useEffect(() => {
    setIsLoader(true);
    if (searchText === '') {
      setIsLoader(false);
      setFilteredData(data);
    } else {
      const filtered = data.filter(item =>
        (item?.type + item?.clientName)
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
      setIsLoader(false);

    }
  }, [searchText, data]);


  return (
    <>
      <ScreenHeader isGoBack={true} onPress={() => { navigation.goBack() }} isShowTitle={true} title="Bills" />

      {/* Scrollable Tabs */}
      <View style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, opacity: 0.8, backgroundColor: COLORS?.PRIMARY_COLOR, borderRadius: 10 }}>
          <MyText style={{ color: COLORS?.whiteColors, fontWeight: '400', fontSize: calculatefontSize(1.7) }}>All matters</MyText>
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
            style={{ height: 30, width: 30, resizeMode: 'contain' }}
          />
        </View>

        {/* Task List */}
        {isLoader ? <Loader /> : filteredData?.length > 0 ? <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            console.log(item, 'billl itration ====d=======>');

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
                <View style={{ gap: 5, width: "65%" }}>
                  <MyText style={styles.timeColor}>Issue {moment(item?.issueDate).format('DD-MM-YYYY')}</MyText>
                  {item?.clientName && <MyText style={[styles.txtStyle, { fontWeight: '300' }]}>
                    {item?.clientName} - {item?.type}
                  </MyText>}
                  <MyText style={[styles.timeColor,]}>Overdue {moment(item?.dueDate).fromNow()}</MyText>
                </View>
                <View style={{ gap: 5, width: "35%", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 10, }}>
                  <MyText style={[styles.txtStyle, { fontWeight: '300', }]}>
                    {formatNumber(Number(item?.balance))}
                  </MyText>                  <View
                    style={{
                      backgroundColor: item?.status === 'PENDING' ? COLORS?.PRIMARY_COLOR : '#ffc2cd',
                      // alignSelf: 'flex-end',
                      borderRadius: 5,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <MyText
                      style={{
                        // fontWeight: '600',
                        // textAlign: 'center',
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
            <RefreshControl refreshing={refreshing} onRefresh={fetchBills} />
          }
        /> :
          <>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Bills} style={{ height: 30, width: 30, resizeMode: "contain" }} />
              <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Bill Found</MyText>
            </View>
          </>
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
});
