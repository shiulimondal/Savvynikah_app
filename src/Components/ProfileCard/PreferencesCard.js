import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from 'react-native-basic-elements';

const { height, width } = Dimensions.get('screen');
const PreferencesCard = ({userProfileData}) => {
    const colors = useTheme();
    return (
        <View style={styles.container}>
            <Text style={{ ...styles.Presonal_txt, color: colors.secondaryFontColor }}>Preferences</Text>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Address</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.address}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>State</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.state?.name}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>City</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.city?.name}</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>PIN</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.pin}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Hobby</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.hobby}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Habbit</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.habits}</Text>
            </View>

         
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: moderateScale(15),
    },
    Presonal_txt: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(14),
    },
    name_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: moderateScale(7),
        paddingBottom: moderateScale(5),
        width: width - moderateScale(100),
    },
    name_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12)
    },
    username_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
        textAlign:'right'
    },
});

export default PreferencesCard;

