import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput, Dimensions } from 'react-native';
import { Icon } from 'react-native-basic-elements';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';

const { height, width } = Dimensions.get('screen');
const OcupationPicker = ({ label, options, selectedValue, onValueChange, labelKey = "option_name", valueKey = "id", placeholder = "Select" }) => {
  const [modalVisible, setModalVisible] = useState(false);


  // Ensure options is always an array to avoid errors
  const safeOptions = Array.isArray(options) ? options : [];

  // Find the name corresponding to the selectedValue (id)
  const selectedOption = safeOptions.find(option => option[valueKey] === selectedValue);
  const displayValue = selectedOption ? selectedOption[labelKey] : placeholder;

  const handleOptionPress = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerText}>
            {displayValue}
        </Text>
        <Icon name="down" type='AntDesign' size={16} style={styles.icon} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.header_txt}>Select an Item</Text>
            <FlatList
              showsVerticalScrollIndicator={true}
              data={options}
              keyExtractor={(item) => item[valueKey].toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleOptionPress(item[valueKey])}
                >
                  <Text style={styles.optionText}>{item[labelKey]}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity  onPress={() => setModalVisible(false)} style={styles.button}>
              <Text style={{
                fontSize: 14,
                color: '#fff'
              }}>Close</Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>

      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginTop: -15
  },
  label: {
    fontSize: 16,
    // marginBottom: 8,
    color: '#000'
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#F6F5F5',
    height: 45,
    width: 330
  },
  pickerText: {
    fontSize: 14,
    color: '#000'
  },
  icon: {
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    height: 300
  },
  header_txt: {
    fontSize: 15,
    color: 'rgba(30,68,28,255)',
    textAlign: 'center',
    fontWeight: '600'
  },
  option: {
    padding: 10,
    // borderBottomWidth:1
  },
  optionText: {
    fontSize: 13,
    color: '#000'
  },
  button: {
    height: 40,
    width: 260,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30,68,28,255)',
    borderRadius: 10
  }
});

export default OcupationPicker;
