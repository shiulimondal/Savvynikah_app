import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from 'react-native-basic-elements';

const { height, width } = Dimensions.get('screen');
const PresonalInfoCard = ({ userProfileData }) => {

    console.log('userrrrrrrrrrrrrrrrrrr00000000000000000000000000rrrrrrrrrrrrrrr',userProfileData);
    
    const colors = useTheme();
    const [isExpanded, setIsExpanded] = useState(false);

    function toFeet(n) {
        var realFeet = (n * 0.3937) / 12;
        var feet = Math.floor(realFeet);
        var inches = Math.round((realFeet - feet) * 12);
        return feet + 'ft-' + inches + 'inch';
    }

    const DateofBirth = new Date(userProfileData?.dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

    return (
        <View style={styles.container}>
            <Text style={{ ...styles.Presonal_txt, color: colors.secondaryFontColor }}>Presonal Information</Text>

            <Text
                // numberOfLines={isExpanded ? undefined : 5}
                style={{ ...styles.Presonal_details_txt,color:'#000' }}
            >
                {userProfileData?.description}
            </Text>

            {/* <Pressable onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={{ ...styles.toggleText, color: colors.secondaryFontColor }}>
                    {isExpanded ? 'See Less' : 'See More'}
                </Text>
            </Pressable> */}
            <Text style={{
                ...styles.Presonal_txt,
                marginTop: moderateScale(10),
                color: colors.secondaryFontColor
            }}>Basic Details</Text>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Name</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.name}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Age</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.age} Years</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Sector Name </Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.sect?.name}</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Gender</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.gender}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Height</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{toFeet(userProfileData?.height)}</Text>
            </View>
            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Weight</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.weight} kg</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Cast</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.caste}</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>Maslak</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{userProfileData?.maslak?.name}</Text>
            </View>

            <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>DOB</Text>
                <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{DateofBirth}</Text>
            </View>

            <Text style={{
                ...styles.Presonal_txt,
                marginTop: moderateScale(10),
                color: colors.secondaryFontColor
            }}>Habbits</Text>
             <View style={styles.name_view}>
                <Text style={{ ...styles.name_txt, color: colors.light_txt }}>{userProfileData?.habits}</Text>
                {/* <Text style={{ ...styles.username_txt, color: colors.secondaryFontColor }}>{DateofBirth}</Text> */}
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
    Presonal_details_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(13),
    },
    toggleText: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
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
        textAlign: 'right'
    },
});

export default PresonalInfoCard;
