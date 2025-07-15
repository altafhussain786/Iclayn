import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch } from 'react-redux';
import MyText from '../../../../components/MyText';
import { COLORS } from '../../../../constants';
import { removeRelatedContact, updateParty, updatePartyType, updateRelatedContact, updateRelationShip } from '../../../../store/slices/matterSlice/createItemforRelateParties';
import BottomModalListWithSearch from '../../../../components/BottomModalListWithSearch';
import httpRequest from '../../../../api/apiHandler';
import { calculatefontSize } from '../../../../helper/responsiveHelper';
import TextInputWithTitle from '../../../../components/TextInputWithTitle';

const RelatedPartiesItems = ({ item, navigation }) => {
    //Account name Selections
    const [selectPartyType, setselectPartyType] = useState(item?.partyType || 'Select Party Types');
    const [relationship, setRelationship] = useState(item?.relationship || '');
    const [selectPartyTypeId, setselectPartyTypeId] = useState(item?.partyTypeId || '');
    const [partyName, setPartyName] = useState(item?.party || 'What is the contacts name ?');
    const [isOpenPartyName, setIsOpenPartyName] = useState(false);
    const [isOpenselectPartyType, setIsOpenselectPartyType] = useState(false);
    const [partyNameData, setPartyNameData] = useState([]);
    const [partyTypeData, setpartyTypeData] = useState([]);
    const dispatch = useDispatch();
    const PID = item?.pId;

    const getPartyTypes = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/pt/`,
            navigation: navigation
        })
        if (res) {
            setpartyTypeData(res?.data);
            if (item?.partyTypeId) {
               
                const selectedPartyType = res?.data?.find(pt => pt?.partyTypeId === item?.partyTypeId);
                setselectPartyType( selectedPartyType?.name);
            }

        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }
    const getPartyNames = async () => {
        const { res, err } = await httpRequest({
            method: `get`,
            path: `/ic/party/?status=Active`,
            navigation: navigation
        })
        if (res) {
            setPartyNameData(res?.data);
            if (item?.partyId) {
                const selectedPartyName = res?.data?.find(pt => pt?.partyId === item?.partyId);
                console.log(selectedPartyName, "selectedPartyName======fffff============>");

                setPartyName(selectedPartyName?.type === "Individual" ? `${selectedPartyName?.firstName} ${selectedPartyName?.lastName}` : selectedPartyName?.companyName);
            }
        }
        else {
            console.log(err, "GET CUSTOMER RESPONSE===>err");
        }
    }

    useEffect(() => {
        getPartyNames();
    }, [isOpenPartyName])

    useEffect(() => {
        getPartyTypes();
    }, [isOpenselectPartyType])

    const handleRemoveItem = () => {
        console.log(item, "====?");

        dispatch(removeRelatedContact({
            pId: item?.pId
        }))

    };

    return (
        <>
            <View style={{ borderBottomWidth: 0.5, borderColor: COLORS?.BORDER_LIGHT_COLOR }}>
                <View >

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ width: "75%" }}>
                            <>
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: COLORS?.DIVIDER_BORDER_COLOR, borderRadius: 5, marginTop: 10 }}>
                                    <TouchableOpacity onPress={handleRemoveItem}>
                                        <AntDesign name="delete" size={20} color="red" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setIsOpenselectPartyType(true)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                        <MyText style={{ color: selectPartyType == "Select Party Types" ? COLORS?.LIGHT_COLOR : COLORS?.PRIMARY_COLOR }}>{selectPartyType}</MyText>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: COLORS?.BORDER_LIGHT_COLOR, borderWidth: 0.5, padding: 8, borderColor: COLORS?.DIVIDER_BORDER_COLOR, borderRadius: 5, marginTop: 10 }}>

                                    <TouchableOpacity onPress={() => setIsOpenPartyName(true)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                        <MyText style={{ color: partyName == "What is the contacts name ?" ? COLORS?.LIGHT_COLOR : COLORS?.PRIMARY_COLOR }}>{partyName}</MyText>
                                    </TouchableOpacity>
                                </View>
                                <TextInputWithTitle
                                    value={relationship}
                                    title="Relationship"
                                    placeholder={'Relationship'}
                                    onChangeText={(txt) => { setRelationship(txt); dispatch(updateRelationShip({ pId: PID, relationship: txt })) }}
                                />

                                {/* <TouchableOpacity onPress={() => console.log(item)
                                }>
                                    <Text>LOG</Text>
                                </TouchableOpacity> */}
                            </>
                        </View>

                        {/* //Modals for account name */}
                        <BottomModalListWithSearch
                            onClose={() => setIsOpenselectPartyType(false)}
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    onPress={() => {
                                        // console.log(item, "item");
                                        setselectPartyTypeId(item?.partyTypeId);
                                        dispatch(updateRelatedContact(
                                            {
                                                pId: PID,
                                                partyType: item.name || '',
                                                partyTypeId: item.partyTypeId || '',
                                            }
                                        ));
                                        setPartyName('What is the contacts name ?');
                                        setRelationship('');
                                        setselectPartyType(item?.name);
                                        setIsOpenselectPartyType(false);
                                    }}
                                    style={{
                                        borderBottomWidth: 1,
                                        paddingVertical: 10,
                                        borderColor: COLORS?.BORDER_LIGHT_COLOR
                                    }}
                                >
                                    <MyText
                                        style={{
                                            fontSize: calculatefontSize(1.9)
                                        }}
                                    >
                                        {item?.name}
                                    </MyText>
                                </TouchableOpacity>
                            )}
                            visible={isOpenselectPartyType}
                            data={partyTypeData}
                            searchKey="name"
                        />
                        <BottomModalListWithSearch
                            onClose={() => setIsOpenPartyName(false)}
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    onPress={() => {
                                        dispatch(updateParty(
                                            {
                                                pId: PID,
                                                party: item.companyName || '',
                                                partyId: item.partyId || '',
                                            }
                                        ));
                                        setPartyName(item?.companyName);
                                        setIsOpenPartyName(false);
                                    }}
                                    style={{
                                        borderBottomWidth: 1,
                                        paddingVertical: 10,
                                        borderColor: COLORS?.BORDER_LIGHT_COLOR
                                    }}
                                >
                                    <MyText
                                        style={{
                                            fontSize: calculatefontSize(1.9)
                                        }}
                                    >
                                        {item?.companyName} 
                                    </MyText>
                                </TouchableOpacity>
                            )}
                            visible={isOpenPartyName}
                            data={partyNameData?.filter(item => item?.partyTypeId === selectPartyTypeId)}
                            searchKey="companyName"
                        />
                    </View>
                </View>
            </View>
        </>
    )
}

export default RelatedPartiesItems

const styles = StyleSheet.create({})