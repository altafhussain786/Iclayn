import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenHeader from '../../../components/ScreenHeader'
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';
import MyText from '../../../components/MyText';

//Icons
import Entypo from "react-native-vector-icons/Entypo";
import Wrapper from '../../../components/Wrapper';
import SearchBar from '../../../components/SearchBar';
import FloatingButton from '../../../components/FloatingButton';

const Activities = () => {
  const [tabs, setTabs] = React.useState("Time entries");

  return (
    <>

      <ScreenHeader isShowTitle={true} title='Activities' />
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
          <SearchBar containerStyle={{ width: "90%" }} placeholder='Search a time entry' />
          <Image
            source={IconUri?.CalenderSearch}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
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