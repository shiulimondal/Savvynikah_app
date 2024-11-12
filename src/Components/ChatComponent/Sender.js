// //import liraries
// import React, { Component } from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// // create a component
// const Sender = () => {
//     return (
//         <View style={styles.container}>
//             <Text>Sender</Text>
//         </View>
//     );
// };

// // define your styles
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#2c3e50',
//     },
// });

// //make this component available to the app
// export default Sender;

// import libraries
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { Text, useTheme } from 'react-native-basic-elements';
import { FONTS } from '../../Constants/Fonts';

// create a component
const Sender = ({item}) => {
    const colors = useTheme();
    return (
        <View style={styles.container}>
            <View style={styles.messageContainer}>
                <View style={{...styles.messageBox,backgroundColor:colors.senderView}}>
                    <View style={{...styles.triangle,borderRightColor:colors.senderView}} />
                    <Text numberOfLines={6} style={{ ...styles.messageText, color: colors.secondaryFontColor }}>
                        {item.text}
                    </Text>
                    <View style={{ marginTop: moderateScale(20) }}>
                        <Text style={{ ...styles.timeText, color: colors.secondaryFontColor }}>12:30 PM</Text>
                    </View>

                </View>
            </View>

            <Image source={require('../../assets/images/6dc01.png')} style={styles.userimg} />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: moderateScale(5),
        justifyContent: 'flex-end',
    },
    userimg: {
        height: moderateScale(30),
        width: moderateScale(30),
        resizeMode: 'contain',
        borderRadius: moderateScale(20),
        marginLeft: moderateScale(10),
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: moderateScale(5),
    },
    triangle: {
        position: 'absolute',
        right: -moderateScale(13),
        width: 0,
        height: 0,
        borderRightWidth: moderateScale(15),
        borderLeftWidth: 0,
        borderTopWidth: moderateScale(7),
        borderBottomWidth: moderateScale(2),
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderRightColor: '#fff',
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent',
        transform: [{ rotate: '180deg' }],
    },
    messageBox: {
        padding: moderateScale(10),
        width: moderateScale(230),
        marginRight: moderateScale(10),
        position: 'relative',
        backgroundColor: '#fff',
        borderRadius: moderateScale(5),
        paddingBottom:moderateScale(5)
    },
    messageText: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(13),
    },
    timeText: {
        position: 'absolute',
        bottom: moderateScale(5),
        right: moderateScale(5),
        fontSize: moderateScale(10),
        fontFamily: FONTS.Inter.medium,
    },
});

// make this component available to the app
export default Sender;

