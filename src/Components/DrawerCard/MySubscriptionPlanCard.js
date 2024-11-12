import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from 'react-native-basic-elements';
import { FONTS } from '../../Constants/Fonts';

const MySubscriptionPlanCard = ({ item, index, onSelect, selectedPlan }) => {
    const colors = useTheme();
    const isSelected = selectedPlan === item;

    return (
        <Pressable
            key={index}
            style={{
                ...styles.container,
                borderColor: colors.second_txt,
                backgroundColor: isSelected ? '#E6F3E6' : '#fff'
            }}>
            <View style={styles.main_view}>
                <Text style={{ ...styles.mounth_txt, color: colors.buttonColor }}>{item.name}</Text>
                <Text style={{ ...styles.price_txt, color: colors.light_txt }}>₹{item.price}</Text>
            </View>
            {item.active === 1 ? (
                <View style={{ ...styles.active_view, backgroundColor: colors.second_txt }}>
                    <Text style={{ ...styles.active_txt, color: colors.primaryFontColor }}>Active</Text>
                </View>
            )
                :
                null
            }
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: moderateScale(15),
        marginHorizontal: moderateScale(15),
        borderWidth: moderateScale(2),
        borderRadius: moderateScale(15),
        padding: moderateScale(15),
        // paddingHorizontal:moderateScale(15),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    main_view: {},
    active_view: {
        height: moderateScale(24),
        width: moderateScale(50),
        borderRadius: moderateScale(20),
        alignItems: 'center',
        justifyContent: 'center'
    },
    active_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(10)
    },
    mounth_txt: {
        fontFamily: FONTS.Inter.bold,
        fontSize: moderateScale(15)
    },
    price_txt: {
        fontFamily: FONTS.Inter.bold,
        fontSize: moderateScale(13)
    },
    crowm_img: {
        height: moderateScale(20),
        width: moderateScale(20),
        resizeMode: 'contain'
    }
});

export default MySubscriptionPlanCard;
