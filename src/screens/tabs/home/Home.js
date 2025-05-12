import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ScreenHeader from '../../../components/ScreenHeader';
import Wrapper from '../../../components/Wrapper';
import WelcomeContainer from './components/WelcomeContainer';
import MyText from '../../../components/MyText';
import { COLORS, IconUri } from '../../../constants';
import { calculatefontSize } from '../../../helper/responsiveHelper';

//PKGS
import { CalendarList } from 'react-native-calendars';
//Icons
import Entypo from "react-native-vector-icons/Entypo";
import SearchBar from '../../../components/SearchBar';

const Home = ({ navigation }) => {
  const [tabs, setTabs] = React.useState("Events");
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
      <ScreenHeader onPress={() => { navigation.navigate("Settings") }} />
      <WelcomeContainer />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["Events", "Tasks"].map((item) => (
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

      {/* Tab Content */}
      {tabs === "Events" ? (
        <Wrapper>
          <SearchBar placeholder='Search an event' />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 }}>
            <MyText style={{ fontSize: calculatefontSize(2), color: COLORS?.PRIMARY_COLOR_LIGHT }}>Today</MyText>
            <Image
              source={IconUri?.CalenderSearch}
              style={{ height: 20, width: 20, resizeMode: "contain" }}
            />
          </View>
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
          <FlatList
            showsVerticalScrollIndicator={false}
            data={[1, 2, 3, 4, 5, 5, 6, 6]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={() => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    borderBottomWidth: 1,
                    paddingVertical: 15,
                    borderColor: COLORS?.BORDER_LIGHT_COLOR,
                  }}
                >
                  <View style={{ alignItems: "center", gap: 5 }}>
                    <Image
                      source={IconUri?.CalenderColor}
                      style={{ height: 20, width: 20, resizeMode: "contain" }}
                    />
                    <View
                      style={{
                        height: 25,
                        width: 2,
                        backgroundColor: "#f1f1f1",
                      }}
                    />
                  </View>
                  <View>
                    <MyText style={styles.timeColor}>09:00 - 09:30</MyText>
                    <MyText style={styles.txtStyle}>Property Exchange</MyText>
                    <MyText style={styles.timeColor}>
                      A2-202202 - Matter name here
                    </MyText>
                  </View>
                </View>
              );
            }}
          />
        </Wrapper>
      ) : (
        <Wrapper>
          <MyText style={styles.taskText}>Task</MyText>
        </Wrapper>
      )}
    </>
  );
};

export default Home;

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
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  timeColor: {
    color: COLORS?.LIGHT_COLOR,
    fontSize: calculatefontSize(1.5),
  },
  txtStyle: {
    color: COLORS?.PRIMARY_COLOR,
    fontSize: calculatefontSize(1.9),
    fontWeight: '300',
  },
  taskText: {
    fontSize: 18,
    color: COLORS.PRIMARY_COLOR,
    // textAlign: 'center',
    marginTop: 20,
  },
});
