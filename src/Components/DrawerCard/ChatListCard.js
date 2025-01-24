//import liraries
import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Icon, useTheme } from 'react-native-basic-elements';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { TouchableOpacity } from 'react-native';
import NavigationService from '../../Services/Navigation';
import HomeService from '../../Services/HomeServises';

// create a component
const ChatListCard = ({ item, index }) => {
    const colors = useTheme();
    const unseenMessage = item?.unread_messages_count > 99 ? '99+' : item?.unread_messages_count;

    console.log('ggggggggggggggggggggggggggg====================itemmmmm==========',item);
    const getChatWith = (itemID) => {
        const data = {
            "user_id": itemID
        };
        console.log('Fetching chat data------------------------------------- for user:', data);   
        HomeService.setChatUser(data)
            .then((res) => {
                console.log('Fetched chat user response:=============================', res);
                if (res && res.status === true) {
                    NavigationService.navigate('SingleChatScreen', {
                        chatData: res.data,
                        senderName: item?.receiver_name
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching chat user:", error);
            });
    };

    
    return (
        <TouchableOpacity
            key={index}
            onPress={() => getChatWith(item?.receiver_id)}
            style={{ ...styles.container, backgroundColor: colors.secondaryThemeColor }}>
            <Image source={{ uri: item?.receiver_image }} style={styles.user_img} />
            <View style={styles.meddagebody}>
                <View>
                    <Text style={{ ...styles.user_name, color: colors.secondaryFontColor }}>{item?.receiver_name}</Text>
                    <Text style={{ ...styles.message_txt, color: colors.light_txt }}>{item?.lastMessage?.message_body}</Text>
                </View>
                <View style={{alignItems:'center'}}>
                    {
                        item?.unread_messages_count > 0 ?
                            <View style={styles.unread_circle}>
                                <Text style={{ ...styles.countnumber, color: colors.secondaryThemeColor }}>
                                    {unseenMessage}</Text>
                            </View>
                            :
                            null
                    }
                    <Text style={{ ...styles.countnumber,marginTop:moderateScale(7), color: colors.secondaryFontColor }}>
                        {item?.lastMessage?.time}</Text>
                </View>

            </View>

        </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        padding: moderateScale(10),
        paddingHorizontal: moderateScale(15)
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
    message_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
        marginTop: moderateScale(10)
    },
    meddagebody: {
        marginLeft: moderateScale(10),
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between'
    },
    unread_circle: {
        height: moderateScale(18),
        width: moderateScale(18),
        borderRadius: moderateScale(9),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(2,142,0,0.6)'
    },
    countnumber: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(9),
    }
});

//make this component available to the app
export default ChatListCard;



