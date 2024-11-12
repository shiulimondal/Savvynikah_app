import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-basic-elements';
import { FONTS } from '../Constants/Fonts';

const MultiSelectPicker = ({ data, placeholder, onSelectItem }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);


  const toggleItemSelection = (item) => {

    const nextSelectedItems = selectedItems.includes(item.id)
      ? selectedItems.filter((selectedId) => selectedId !== item.id)
      : [...selectedItems, item.id];

    setSelectedItems(nextSelectedItems);
  };

  useEffect(() => {
    onSelectItem && onSelectItem(selectedItems);
  }, [selectedItems]);

  const removeSelectedItem = (id) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.filter((selectedId) => selectedId !== id)
    );
  };



  return (
    <View style={styles.container}>

      {/* <View style={styles.selectedItemsContainer}>
        {selectedItems.map((id) => {
          const selectedItem = data.find((item) => item.id === id);
          return (
            <View key={id} style={styles.selectedItem}>
              <Text style={{
                fontSize: 13,
                fontFamily: FONTS.Inter.medium,
                color: '#000'
              }}>{selectedItem.name}</Text>
              <TouchableOpacity onPress={() => removeSelectedItem(id)}>
                <Icon name="close" type="AntDesign" size={20} color="#000" />
              </TouchableOpacity>
            </View>
          );
        })}
      </View> */}


      <TouchableOpacity style={styles.openPickerButton} onPress={() => setPickerVisible(true)}>

        {selectedItems.length > 0 ? (
          <Text style={{
            fontSize: 13,
            fontFamily: FONTS.Inter.medium,
            color: '#000'
          }}>
            {selectedItems
              .map((id) => {
                const selectedItem = data.find((item) => item.id === id);
                return selectedItem ? selectedItem.name : '';
              })
              .filter(Boolean)
              .join(', ')}
          </Text>
        ) : (
          <Text style={{
            fontSize: 13,
            fontFamily: FONTS.Inter.regular,
            color: '#000'
          }}>{placeholder}</Text>
        )}


        <Icon name="down" type="AntDesign" size={17} color="#000" />
      </TouchableOpacity>

      <Modal visible={isPickerVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Items</Text>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => toggleItemSelection(item)}
                >
                  <Text style={selectedItems.includes(item.id) ? styles.selectedText : styles.unselectedText}>
                    {item.name}
                  </Text>
                  {selectedItems.includes(item.id) && (
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
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    height: 45,
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
