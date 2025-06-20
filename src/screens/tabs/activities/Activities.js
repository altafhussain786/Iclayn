import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenHeader from '../../../components/ScreenHeader'
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize, getResponsiveWidth } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

//Icons
import Entypo from "react-native-vector-icons/Entypo";
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';
import httpRequest from '../../../api/apiHandler';
import Loader from '../../../components/Loader';
import { formatNumber } from '../../../helper/Helpers';
import moment from 'moment';

const Activities = ({ navigation }) => {
  const [tabs, setTabs] = React.useState("Time entries");
  const [activityData, setActivityData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [searchText, setSearchText] = useState(''); // ✅ for search
  const [loader, setLoader] = React.useState(false);


  const getActivityData = async () => {
    setLoader(true)
    const { res, err } = await httpRequest({
      method: 'get',
           navigation:navigation,
      path: tabs === "Time entries" ? `/ic/matter/time-entry/` : `/ic/matter/exp-entry/`
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


  useEffect(() => {
    getActivityData();
  }, [tabs])
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
  return (
    <>

      <ScreenHeader onPress={() => { navigation.navigate("Settings") }} isShowTitle={true} title='Activities' />
      <View style={styles.tabContainer}>
        {["Time entries", "Expenses"].map((item) => (
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
      <Wrapper>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <SearchBar
            containerStyle={{ width: "90%" }}

            placeholder="Search a task"
            value={searchText}
            onChangeText={text => setSearchText(text)}
          />
          <Image
            source={IconUri?.CalenderSearch}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        </View>
        {/* ///RENDER ITEM =====================> */}
        {loader ? <Loader /> :

          filteredData?.length > 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, i }) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      borderBottomWidth: 1,
                      paddingVertical: 15,
                      borderColor: COLORS?.BORDER_LIGHT_COLOR,
                    }}
                  >
                    <View style={{ gap: 5, width: "65%", }}>
                      <MyText style={styles.timeColor}>{moment(item?.entryDate).format("DD-MM-YYYY")}</MyText>
                      <MyText style={[styles.txtStyle, { fontWeight: "300" }]}>{item?.matterName}</MyText>
                      {item?.description !== "" && <MyText style={styles.timeColor}>
                        {item?.description}
                      </MyText>}
                    </View>
                    <View style={{ gap: 5, width: "35%", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 10, }}>
                      <MyText style={[styles.timeColor, { fontWeight: "600", textAlign: "right" }]}>${formatNumber(item?.amount)}</MyText>
                      <MyText style={[styles.txtStyle, { textAlign: "right" }]}>{item?.duration}</MyText>
                      <View style={{ backgroundColor: "#ffc2cd", alignSelf: "flex-end", width: getResponsiveWidth(20), borderRadius: 5, paddinHorizontal: 30 }}>
                        <MyText style={[styles.timeColor, { fontWeight: "300", textAlign: "center", color: "#6c0014" }]}>
                          {item?.billed ? "Billed" : "Unbilled"}
                        </MyText>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
            :
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 10 }}>
              <Image tintColor={COLORS.PRIMARY_COLOR} source={IconUri?.Activities} style={{ height: 30, width: 30, resizeMode: "contain" }} />
              <MyText style={{ fontSize: calculatefontSize(1.5), color: COLORS.PRIMARY_COLOR }}>No Data Found</MyText>
            </View>
        }
        <FloatingButton
          icon="plus"
          navigateTo="CreateScreen"
          backgroundColor={COLORS.PRIMARY_COLOR_LIGHT}
          size={50}
          iconSize={25}
        />
      </Wrapper>
    </>
  )
}

export default Activities

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
})