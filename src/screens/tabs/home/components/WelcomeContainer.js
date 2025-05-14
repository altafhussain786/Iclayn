import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import MyText from '../../../../components/MyText'
import { COLORS } from '../../../../constants'
import { calculatefontSize } from '../../../../helper/responsiveHelper'
import { useSelector } from 'react-redux'
import httpRequest from '../../../../api/apiHandler'

const WelcomeContainer = () => {
  const [personalData, setPersonalData] = React.useState({});
  const userDetails = useSelector(state => state?.userDetails?.userDetails);
  console.log(userDetails, "userDetails=====>");
  const { userProfileDTO } = userDetails
  const imageURL = `data:image/jpeg;base64,${userProfileDTO?.image}`;

  const getPersonalData = async () => {
    const { res, err } = await httpRequest({
      method: 'get',
      path: `/ic/db/personal/${userDetails?.userId}`,
    })
    if (res) {
      console.log(res, "res================>");

      setPersonalData(res?.data);
    }
    else {
      console.log("err", err);
    }
  }
  useEffect(() => {
    getPersonalData();
  }, [userDetails])
  return (
    <>
      <View style={styles.container}>
        <View>
          {/* <Image source={{ uri: imageURL }} style={{ height: 30, width: 30, borderRadius: 50 ,resizeMode:"contain"}}/> */}
          <MyText style={styles.nameStyle}>Hi, {userProfileDTO?.firstName}</MyText>
        </View>
        <View>
          <MyText style={styles.messageStyle}>You have <Text style={{ color: COLORS?.yellow, fontWeight: "bold" }}>{personalData?.todayEventDTOList?.length} Event{personalData?.todayEventDTOList?.length > 1 && "s"} </Text> </MyText>
          <MyText style={styles.messageStyle}>and <Text style={{ color: COLORS?.yellow, fontWeight: "bold" }}> {personalData?.todayTaskDTOList?.length}  task{personalData?.todayTaskDTOList?.length > 1 && "s"} </Text> schedule today</MyText>
        </View>
      </View>
    </>
  )
}

export default WelcomeContainer

const styles = StyleSheet.create({
  container: {
    flex: 0.3,
    paddingHorizontal: 20,
    gap: 10,
    backgroundColor: COLORS?.PRIMARY_COLOR_LIGHT
  },
  nameStyle: {
    color: COLORS?.whiteColors,
    fontSize: calculatefontSize(4),
    fontWeight: "bold"
  },
  messageStyle: {
    color: COLORS?.whiteColors,
    fontSize: calculatefontSize(2),
    fontWeight: "300"
  }
})