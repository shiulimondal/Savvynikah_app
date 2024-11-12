import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'react-native-basic-elements';
import { FONTS } from '../Constants/Fonts';
import { moderateScale } from '../Constants/PixelRatio';


const { height, width } = Dimensions.get('screen');

const CustomDropdown = ({
    options,
    selectedValue,
    onValueChange,
    labelKey = "name",
    valueKey = "id",
    placeholder = "Select",
    textStyle = {},
    containerStyle = {}
}) => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleOptionPress = (value) => {
        onValueChange(value);
        setModalVisible(false);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity
                style={styles.pickerContainer}
                onPress={() => setModalVisible(true)}
            >
                <Text style={[styles.pickerText, textStyle]}>
                    {selectedValue ? options.find(option => option[valueKey] === selectedValue)?.[labelKey] : placeholder}
                </Text>
                <Icon name="down" type="AntDesign" size={15} color="#000" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select an Item</Text>
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
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>


            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: moderateScale(-10),
    },
    pickerContainer: {
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
        // marginTop:20
    },
    pickerText: {
        fontSize: moderateScale(13),
        fontFamily: FONTS.Inter.regular,
        color: '#000'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: 'rgba(30,68,28,255)'
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
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    optionText: {
        fontSize: moderateScale(13),
        fontFamily: FONTS.Inter.regular,
        color: '#000'
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

export default CustomDropdown;
