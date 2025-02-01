//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { Image } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { AppButton, useTheme } from 'react-native-basic-elements';
import HomeService from '../../Services/HomeServises';
import { useSelector } from 'react-redux';
import NavigationService from '../../Services/Navigation';

// create a component
const MyProfile = () => {
    const colors = useTheme();
    const { userData } = useSelector(state => state.User)
    const [userProfileData, setUserProfileData] = useState([])
//   console.log('userDatauserDatauserDatauserData',userData);

    useEffect(() => {
        geUserFullProfile()
    }, [])

    const geUserFullProfile = () => {
        
        HomeService.getUserProfile()
            .then((res) => {
                // console.log('---------------------------------------0000000000000000000000--------', JSON.stringify(res));
                if (res && res.status === true) {
                    setUserProfileData(res.data);
                }

            })
            .catch((err) => {
                console.log('errrr', err);

            })
    }

    const DateofBirth = new Date(userProfileData?.dob).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    return (
        <View style={styles.container}>
            <View style={styles.user_view}>
                <Image
                    source={userProfileData?.profile_images?.length > 0 ? { uri: userProfileData?.profile_images[0]?.url } :
                        require('../../assets/images/user.png')}
                    style={styles.user_img} />
                {/* <Image source={require('../../assets/images/6dc01.png')} style={styles.user_img} /> */}
                <View style={{ marginLeft: moderateScale(15) }}>
                    <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{userProfileData?.name}</Text>
                    <Text style={{ ...styles.occupation, color: colors.light_txt }}>{userProfileData?.occupation?.name}</Text>
                </View>
            </View>
            <View style={styles.main_view}>
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>Age</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>{userProfileData?.age} Years</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>Gender</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>{userProfileData?.gender}</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>Height</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>{userProfileData?.height} Cm</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>Weight</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>{userProfileData?.weight} kg</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>Status</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>{userProfileData?.user_marital_status?.name}</Text>
                </View>
                <View style={styles.line} />
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>Language</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>
                    {userProfileData?.languages?.map(language => language.name).join(', ')}
                    </Text>
                </View>
                <View style={styles.line} />
                <View style={styles.age_view}>
                    <Text style={{ ...styles.age_txt, color: colors.light_txt }}>DOB</Text>
                    <Text style={{ ...styles.age_txt, color: colors.secondaryFontColor }}>{DateofBirth}</Text>
                </View>
                <View style={styles.line} />
            </View>
            <AppButton
                textStyle={styles.buttn_txt}
                style={styles.button_sty}
                title="Update Profile"
                gradientStart={{ x: 0.3, y: 1 }}
                gradientEnd={{ x: 1, y: 1 }}
                gradient={true}
                gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
            onPress={() => NavigationService.navigate('EditPresonalInfo')}
            />
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    user_view: {
        marginTop: moderateScale(20),
        marginHorizontal: moderateScale(15),
        flexDirection: 'row',
        alignItems: 'center'
    },
    user_img: {
        height: moderateScale(70),
        width: moderateScale(70),
        borderRadius: moderateScale(40),
        resizeMode: 'cover'
    },
    user_name: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(15)
    },
    occupation: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12)
    },
    main_view: {
        marginTop: moderateScale(25),
        marginHorizontal: moderateScale(15)
    },
    age_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: moderateScale(5),
        paddingBottom: moderateScale(5)
    },
    line: {
        borderWidth: .3,
        borderColor: '#707070',
        marginTop: moderateScale(3)
    },
    age_txt: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(13)
    },
    buttn_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(14)
    },
    button_sty: {
        height: moderateScale(40),
        width: moderateScale(130),
        borderRadius: moderateScale(7),
        alignSelf: 'center',
        marginTop: moderateScale(40)
    }
});

//make this component available to the app
export default MyProfile;
