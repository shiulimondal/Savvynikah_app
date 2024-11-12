import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, StatusBar } from 'react-native-basic-elements';
import { Colors } from '../../Constants/Colors';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import NavigationService from '../../Services/Navigation';

const HomeHeader = ({ route }) => {
    const progress = useSharedValue(0);

    const handlePress = () => {
        progress.value = withTiming(1, {}, (isFinished) => {
            if (isFinished) {
                runOnJS(NavigationService.openDrawer)();
            }
        });
    };

    const getHeaderTitle = (routeName) => {
        switch (routeName) {
            case 'Home':
                return 'Search For Partner';
            case 'MyProfile':
                return 'Profile';
            case 'MyVisitor':
                return 'Visitor';
            case 'Setting':
                return 'Settings';
            case 'MySubscription':
                return 'My Subscription';
            case 'MyChat':
                return 'Chat List';
            case 'MyWishlist':
                return 'Wishlist';
            case 'SingleChatScreen':
                return 'Search For Partner';
            case 'ViewProfile':
                return 'Search For Partner';
            case 'GetPremium':
                return 'Get Premium';
            case 'PaymentSucess':
                return 'Payment Sucess';
            default:
                return 'App';
        }

    };

    return (
        <View style={styles.main_view}>
            <StatusBar
                backgroundColor={Colors.buttonColor}
                barStyle="light-content"
            />
            <View style={styles.secondary_view}>
                {
                    route.name === 'SingleChatScreen' ?
                        <TouchableOpacity onPress={() => NavigationService.navigate('MyChat')}>
                            <Icon name="arrowleft" type="AntDesign" />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={handlePress}>
                            <Icon name="bars" type="FontAwesome" />
                        </TouchableOpacity>

                }
                <Text style={styles.header_txt}>{getHeaderTitle(route.name)}</Text>
                {
                    route.name === 'SingleChatScreen' ?
                        <Icon name="bell" type="Feather" color={Colors.buttonColor} />
                        :
                        <Icon name="bell" type="Feather"  color={Colors.buttonColor}/>

                }

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

export default HomeHeader;
