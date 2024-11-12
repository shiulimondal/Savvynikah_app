//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'react-native-basic-elements';
import { Colors } from '../../Constants/Colors';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';



// create a component
const Header = ({title=''}) => {
    return (
        <View style={styles.main_view}>
            <StatusBar
                backgroundColor={Colors.buttonColor}
                barStyle='light-content'
            />
            <View>
                <Text style={styles.header_txt}>{title ? title : null}</Text>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    main_view: {
        height:moderateScale(50),
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.buttonColor
    },
    header_txt: {
       fontFamily:FONTS.Inter.medium,
       fontSize:moderateScale(14),
       color:Colors.secondaryFont
    }
});

//make this component available to the app
export default Header;
