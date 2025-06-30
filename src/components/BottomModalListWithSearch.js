import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TextInput
} from 'react-native';
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLORS } from '../constants';


const { height } = Dimensions.get('window');

const BottomModalListWithSearch = ({
  visible,
  data = [],
  renderItem,
  keyExtractor,
  onClose,
  title,
  modalStyle = {},
  listStyle = {},
  closeText = "Close",
  searchKey = "name"
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // useEffect(() => {
  //   // Filter data when searchQuery changes
  //   const newData = data?.filter(item =>
  //     item[searchKey]?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  //   );
  //   setFilteredData(newData);
  // }, [searchQuery, data, searchKey]);

  useEffect(() => {
    const newData = Array.isArray(data)
      ? data.filter(item =>
          item?.[searchKey]?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        )
      : [];
  
    setFilteredData(newData);
  }, [searchQuery, data, searchKey]);

  return (
    <Modal statusBarTranslucent transparent visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContainer, modalStyle, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="closecircle" size={20} color="red" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholderTextColor={COLORS?.LIGHT_COLOR}
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
              removeClippedSubviews={false}
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[styles.listContainer, listStyle]}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: height * 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default BottomModalListWithSearch;
