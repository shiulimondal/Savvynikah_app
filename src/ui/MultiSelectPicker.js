import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-basic-elements';
import { FONTS } from '../Constants/Fonts';

const MultiSelectPicker = ({ data, placeholder, onSelectItem }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItemSelection = (item) => {
    const updatedItems = selectedItems.some(selected => selected.value === item.value)
      ? selectedItems.filter(selected => selected.value !== item.value)
      : [...selectedItems, item];

    setSelectedItems(updatedItems);
  };

  useEffect(() => {
    onSelectItem && onSelectItem(selectedItems);
  }, [selectedItems]);



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.openPickerButton} onPress={() => setPickerVisible(true)}>
        <Text style={{ fontSize: 13, fontFamily: FONTS.Inter.medium, color: '#000' }}>
          {selectedItems.length > 0
            ? selectedItems.map(item => item.label).join(', ')
            : placeholder}
        </Text>
        <Icon name="down" type="AntDesign" size={17} color="#000" />
      </TouchableOpacity>

      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Items</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item?.value?.toString()}
              renderItem={({ item,index }) => (
                <TouchableOpacity
                index={index}
                  style={styles.optionItem}
                  onPress={() => toggleItemSelection(item)}
                >
                  <Text style={selectedItems.some(selected => selected.value === item.value) ? styles.selectedText : styles.unselectedText}>
                    {item.label}
                  </Text>
                  {selectedItems.some(selected => selected.value === item.value) && (
                    <Icon name="checkmark" size={20} color="green" />
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setPickerVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MultiSelectPicker;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2,142,0,0.1)',
    padding: 2,
    borderRadius: 20,
    margin: 2,
    paddingHorizontal: 10,
    marginBottom: 7
  },
  openPickerButton: {
    backgroundColor: '#F6F5F5',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    // height: 45,
    borderWidth: 1,
    borderColor: '#999',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    height: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000'
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedText: {
    fontWeight: 'bold',
    color: 'green',
  },
  unselectedText: {
    color: 'black',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'rgba(30,68,28,255)',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
