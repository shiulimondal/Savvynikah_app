//import liraries
import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon, useTheme } from 'react-native-basic-elements';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';

// create a component
const VisitorCard = ({ item, index }) => {
    const colors = useTheme();
    function toFeet(n) {
        var realFeet = (n * 0.3937) / 12;
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        return feet + 'ft-' + inches + 'inch';
    }
    return (
        <Card
        onPress={()=>NavigationService.navigate('ViewProfile',{userId:item.id})}
            key={index} style={styles.container}>

            <Image
                source={item?.profile_images?.length > 0 ? { uri: item?.profile_images[0]?.url } :
                    require('../../assets/images/user.png')}
                style={styles.user_img} />

            <View style={{ marginLeft: moderateScale(10) }}>
                <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{item.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                    {item.occupation ? (
                        <Text numberOfLines={1} style={{ ...styles.devloper_txt, color: colors.light_txt }}>
                            {item.occupation}
                        </Text>
                    ) : null}
                    <Text style={{ ...styles.age_txt, color: colors.light_txt, }}> {item.age} years </Text>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>({toFeet(item.height)})</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    {item.caste ? (
                        <Text style={{ ...styles.age_txt, color: colors.light_txt }}>{item.caste}</Text>
                    ) : null}
                    {item.city || item.state ? (
                        <Text style={{ ...styles.age_txt, color: colors.light_txt }}>{item.city}{item.state}</Text>
                    ) : null}

                </View>


            </View>
        </Card>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: moderateScale(7),
        marginTop: moderateScale(10),
        // marginHorizontal: moderateScale(10)
    },
    user_img: {
        height: moderateScale(65),
        width: moderateScale(65),
        borderRadius: moderateScale(40),
        resizeMode: 'cover'
    },
    user_name: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(14)
    },
    devloper_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
        maxWidth: '50%'
    },
    age_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12)
    }
});

//make this component available to the app
export default VisitorCard;
