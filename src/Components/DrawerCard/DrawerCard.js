import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { Colors } from '../../Constants/Colors';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';
import { Icon, useTheme } from 'react-native-basic-elements';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../Services/Auth';
import { logout } from '../../Redux/reducer/User';
import Toast from "react-native-simple-toast";
import HomeService from '../../Services/HomeServises';


const DrawerCard = () => {
    const colors = useTheme();
    const dispatch = useDispatch();
    const { userData } = useSelector(state => state.User)
    const [userProfileData, setUserProfileData] = useState([])    
    

    const drawerScreen = [
        {
            img: require('../../assets/images/profile.png'),
            title: 'My Profile',
            handleClick: 'MyProfile'
        },
        {
            img: require('../../assets/images/visitor.png'),
            title: 'My Visitor',
            handleClick: 'MyVisitor'
        },
        {
            img: require('../../assets/images/seeting.png'),
            title: 'Settings',
            handleClick: 'Setting'
        },
        {
            img: require('../../assets/images/subscription.png'),
            title: 'My Subscription',
            handleClick: 'MySubscription'
        },
        {
            img: require('../../assets/images/subscription.png'),
            title: 'Get Premium',
            handleClick: 'GetPremium'
        },
        {
            img: require('../../assets/images/chat.png'),
            title: 'My Chat',
            handleClick: 'MyChat'
        },
        {
            img: require('../../assets/images/wishlist.png'),
            title: 'My Wishlist',
            handleClick: 'MyWishlist'
        },
        // {
        //     img: require('../../assets/images/logout.png'),
        //     title: 'Sign Out',
        //     handleClick: logoutUser()
        // },
    ];

    const handleDrawerScreen = (item) => {
        if (item) {
            NavigationService.openDrawer()
            NavigationService.navigate(item.handleClick);
            NavigationService.closeDrawer()
        }
    }

    const logoutUser = () => {
        Toast.show('Logged Out Successfully ', Toast.SHORT);
        AuthService.setToken(null)
        AuthService.setAccount(null);
        NavigationService.navigate('Login')
        dispatch(logout());
    };

   
    useEffect(() => {
        geUserFullProfile()
    }, [])

    const geUserFullProfile = () => {
        HomeService.getUserProfile()
            .then((res) => {
                if (res && res.status === true) {
                    setUserProfileData(res.data);
                }

            })
            .catch((err) => {
                console.log('errrr', err);

            })
    }

  

    return (
        <View style={styles.container_sty}>
            <View style={styles.main_view}>
                <Pressable onPress={() => NavigationService.closeDrawer()}>
                    <Icon type='AntDesign' name='close' size={20} style={styles.icon_view} />
                </Pressable>
                <Pressable
                    // onPress={() => NavigationService.navigate('ViewProfile', { userId: userProfileData.id })}
                    style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.user_circle}>
                        <Image
                            source={userProfileData?.profile_images?.length > 0 ? { uri: userProfileData?.profile_images[0]?.url } :
                                require('../../assets/images/user.png')}
                            style={styles.user_img_sty} />

                    </View>
                    <View style={{ marginLeft: moderateScale(10) }}>
                        <Text style={{ ...styles.user_name, color: colors.primaryFontColor }}>{userProfileData?.name}</Text>
                        <Text style={{ ...styles.user_email, color: colors.primaryFontColor }}>{userProfileData?.email}</Text>
                    </View>
                </Pressable>

            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{ height: moderateScale(20) }} />
                {drawerScreen.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} shadow={false}
                            style={{ ...styles.card_sty }}
                            onPress={() => { handleDrawerScreen(item) }}>
                            <Image source={item?.img} style={{ ...styles.notification_img }} />
                            <Text style={{ ...styles.notification_txt, color: '#fff', }}>{item.title}</Text>
                        </TouchableOpacity>
                    );
                })}
                <TouchableOpacity shadow={false}
                    style={{ ...styles.card_sty }}
                    onPress={() => logoutUser()}>
                    <Image source={require('../../assets/images/logout.png')} style={{ ...styles.notification_img }} />
                    <Text style={{ ...styles.notification_txt, color: '#fff', }}>Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>


        </View>
    );
};

export default DrawerCard;

const styles = StyleSheet.create({
    container_sty: {
        flex: 1,
        backgroundColor: Colors.buttonColor
    },
    icon_view: {
        alignSelf: 'flex-end',
        marginRight: moderateScale(15)
    },
    card_sty: {
        borderRadius: 0,
        alignItems: 'center',
        flexDirection: 'row',
        borderLeftWidth: 4,
        padding: moderateScale(7),
        paddingHorizontal: moderateScale(17),
    },
    user_name: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(14)
    },
    user_email: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(13)
    },
    notification_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(14),
        marginLeft: moderateScale(16),
    },
    main_view: {
        marginHorizontal: moderateScale(25),
        alignSelf: 'center',
        paddingHorizontal: moderateScale(10),
        padding: moderateScale(7),
        width: '100%',
        elevation: 2,
        backgroundColor: Colors.buttonColor,
        paddingBottom: moderateScale(20)

    },
    user_circle: {
        borderRadius: moderateScale(30),
        backgroundColor: '#029000',
        alignItems: 'center',
        justifyContent: 'center',
        height: moderateScale(54),
        width: moderateScale(54)
    },
    user_img_sty: {
        height: moderateScale(48),
        width: moderateScale(48),
        borderRadius: moderateScale(30)
    },

    notification_img: {
        height: moderateScale(30),
        width: moderateScale(30),
        resizeMode: 'contain',
    },
    bottom_text: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(12),
        color: Colors.secondaryFont
    },
});

