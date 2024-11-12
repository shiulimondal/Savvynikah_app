import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from 'react-native-basic-elements';

const { height, width } = Dimensions.get('screen');
const ProfessionalInfoCard = ({userProfileData}) => {
    const colors = useTheme();
    return (
        <View style={styles.container}>
            <Text style={{ ...styles.Presonal_txt, color: colors.secondaryFontColor }}>Professional Information</Text>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Marital Status</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.user_marital_status?.name}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Language</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>
                    {userProfileData?.languages?.map(language => language.name).join(', ')}
                </Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Occupation</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.occupation?.name}</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Education</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.education?.name}</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Lives In</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.lives_in}</Text>
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

export default ProfessionalInfoCard;


