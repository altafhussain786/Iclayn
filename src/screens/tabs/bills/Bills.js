import {
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
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

const Bills = () => {
  const [tabs, setTabs] = React.useState('Upcoming');

  const tabList = ['Upcoming', 'Overdue', 'No due date', 'Completed', 'Archived', 'Delegated'];

  return (
    <>
      <ScreenHeader isShowTitle={true} title="Bills" />

      {/* Scrollable Tabs */}
      <View style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, opacity: 0.8, backgroundColor: COLORS?.PRIMARY_COLOR, borderRadius: 10 }}>
          <MyText style={{ color: COLORS?.whiteColors, fontWeight: '400', fontSize: calculatefontSize(1.9) }}>All matters</MyText>
          <AntDesign name={'down'} size={20} color={COLORS?.whiteColors} />
        </View>
      </View>
      {/* <View style={{ padding: 10, backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT }}>
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
                      opacity: tabs === item ? 1 : 0.5,
                      backgroundColor:
                        COLORS.PRIMARY_COLOR
                    },
                  ]}
                  onPress={() => setTabs(item)}
                >
                  <MyText
                    style={{

                      color: '#fff',
                      fontWeight: tabs === item ? '400' : '400',
                      fontSize: calculatefontSize(1.9),
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
      </View> */}
      <Wrapper>
        {/* Search Row */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SearchBar containerStyle={{ width: '90%' }} placeholder="Search bills" />
          <Image
            source={IconUri?.CalenderSearch}
            style={{ height: 25, width: 25, resizeMode: 'contain' }}
          />
        </View>

        {/* Task List */}
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 1, 3, 14]}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={() => {
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
                  <MyText style={styles.timeColor}>Due 01-05-2025</MyText>
                  <MyText style={[styles.txtStyle, { fontWeight: '600' }]}>
                    Client name
                  </MyText>
                  <MyText style={styles.timeColor}>Bill #: bill-may-50150</MyText>
                </View>
                <View style={{ gap: 5 }}>
                  <MyText style={[styles.txtStyle, { fontWeight: '600' }]}>
                    50050.00
                  </MyText>
                  <MyText />
                  <View
                    style={{
                      backgroundColor: '#ffc2cd',
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
                        color: '#6c0014',
                        fontSize: calculatefontSize(1.4),
                      }}
                    >
                      Draft
                    </MyText>
                  </View>
                </View>
              </View>
            );
          }}
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
