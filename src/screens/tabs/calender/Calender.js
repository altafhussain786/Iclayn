import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenHeader from '../../../components/ScreenHeader'
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

//Icons
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';

const Calender = () => {
  const [tabs, setTabs] = React.useState("Time entries");

  const [selectedDate, setSelectedDate] = React.useState('2025-05-06');
  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toDateString().slice(0, 3),
      num: date.getDate(),
    };
  });
  return (
    <>

      <ScreenHeader isShowTitle={true} title='Calender' />
      <View style={{ padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.whiteColors }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity>
            <AntDesign name={'left'} size={20} color={COLORS?.LIGHT_COLOR} />
          </TouchableOpacity>
          <MyText style={{ fontSize: calculatefontSize(2.5), color: COLORS?.PRIMARY_COLOR, fontWeight: "600" }}>MAy</MyText>
          <TouchableOpacity>
            <AntDesign name={'right'} size={20} color={COLORS?.LIGHT_COLOR} />
          </TouchableOpacity>
        </View>
        <Image
          source={IconUri?.CalenderSearch}
          style={{ height: 25, width: 25, resizeMode: "contain" }}
        />
      </View>
      <View style={styles.tabContainer}>

        <View style={{ backgroundColor: COLORS?.PRIMARY_COLOR, borderRadius: 10, paddingVertical: 20 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={days}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  // padding: 10,
                  // marginHorizontal: 5,

                  borderRadius: 10,
                  width: 45,
                }}
                onPress={() => setSelectedDate(item.date)}
              >
                <Text style={{ color: '#fff', fontSize: calculatefontSize(1.5), marginVertical: 10 }}>{item.day}</Text>
                <Text style={
                  {
                    color: selectedDate === item.date ? COLORS.PRIMARY_COLOR : COLORS.whiteColors,
                    fontSize: calculatefontSize(1.5),
                    height: 20,
                    width: 20,
                    textAlign: "center",
                    borderRadius: 10,
                    backgroundColor:
                      selectedDate === item.date ? COLORS.whiteColors : COLORS.PRIMARY_COLOR,
                  }}>{item.num}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <Wrapper>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <SearchBar containerStyle={{ width: "100%" }} placeholder='Search an event' />

        </View>
        {/* ///RENDER ITEM =====================> */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 5, 6, 6]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => {
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
                <View style={{ gap: 5 }}>
                  <MyText style={styles.timeColor}>01-05-2025 - 01:30 PM</MyText>
                  <MyText style={[styles.txtStyle, { fontWeight: "600" }]}>Phone consultation</MyText>
                  <MyText style={styles.timeColor}>
                    Matter name here
                  </MyText>
                </View>
                <View style={{ gap: 5 }}>
                  <MyText style={[styles.timeColor, { fontWeight: "600", textAlign: "right" }]}>$50.00</MyText>
                  <MyText style={[styles.txtStyle, { textAlign: "right" }]}>01:00:00</MyText>
                  <View style={{ backgroundColor: "#ffc2cd", alignSelf: "flex-end", width: "80%", borderRadius: 5, paddinHorizontal: 20 }}>
                    <MyText style={[styles.timeColor, { fontWeight: "600", textAlign: "center", color: "#6c0014" }]}>
                      Draft
                    </MyText>
                  </View>
                </View>
              </View>
            );
          }}
        />
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

export default Calender

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.whiteColors,
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