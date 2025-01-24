import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, StatusBar } from 'react-native-basic-elements';
import { Colors } from '../../Constants/Colors';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';


const ChatHeader = ({ route ,title}) => {
    return (
        <View style={styles.main_view}>
            <StatusBar
                backgroundColor={Colors.buttonColor}
                barStyle="light-content"
            />
            <View style={styles.secondary_view}>

                <TouchableOpacity onPress={() => NavigationService.navigate('MyChat')}>
                    <Icon name="arrowleft" type="AntDesign" />
                </TouchableOpacity>

                <Text style={styles.header_txt}>{title}</Text>
                <Icon name="bell" type="Feather"  color={Colors.buttonColor}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main_view: {
        height: moderateScale(50),
        width: '100%',
        backgroundColor: Colors.buttonColor,
        paddingTop: moderateScale(15),
        paddingHorizontal: moderateScale(15),
    },
    secondary_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header_txt: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(14),
        color: Colors.secondaryFont,
    },
});

export default ChatHeader;
