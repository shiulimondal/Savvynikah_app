import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-basic-elements';

const SinglePicker = ({ data, placeholder, onSelectItem, defaultSelected }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(defaultSelected || null);

  useEffect(() => {
    if (defaultSelected) {
      setSelectedItem(defaultSelected);
    }
  }, [defaultSelected]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);  
    setPickerVisible(false);
    if (onSelectItem) {
      onSelectItem(item);  
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectedItemContainer} onPress={() => setPickerVisible(true)}>
        <Text style={{
          fontSize:13,
          color:'#000'
        }}>{selectedItem ? selectedItem.name : placeholder}</Text>
        <Icon name="down" type="AntDesign" size={15} color="#000" />
      </TouchableOpacity>

      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Item</Text>

            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => handleItemSelect(item)}>
                  <Text style={styles.optionText}>{item.name}</Text>
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

export default SinglePicker;

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
  },
  selectedItemContainer: {
    backgroundColor: '#F6F5F5',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: '#999',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 150,
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
    color:'#000'
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    color: '#000',
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