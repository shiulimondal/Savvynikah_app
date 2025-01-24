//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import ChatListCard from '../../Components/DrawerCard/ChatListCard';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import HomeService from '../../Services/HomeServises';
import { useTheme } from 'react-native-basic-elements';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ShimmerLoader from '../../ui/ShimmerLoader';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';

const MyChat = () => {
    const colors = useTheme();
    const [loading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const {  } = useSelector(state => state.User);

    console.log('chattttuserDatatttttttttttttttttttttttttttttttttt', JSON.stringify(userList));

    useFocusEffect(
        useCallback(() => {
            const fetchChatUserList = async () => {
                setLoading(true);
                HomeService.setChatUserList()
                    .then((res) => {
                        // console.log('userchattttttttttttttttttttttt=========---------------------==============', JSON.stringify(res));
                        if (res && res.status == true) {
                            setUserList(res.data)
                        }
                        setLoading(false);
                    })
            };
            fetchChatUserList();
            getChatWith();
            return () => { };
        }, [])
    );

    const getChatWith = (itemId,Rname) => {
        console.log('itemId,RnameitemId,RnameitemId,Rname',itemId,Rname);
        
        const data = {
            "user_id": itemId
        };
        console.log('Fetching chat data------------------------------------- for user:', data);   
        HomeService.setChatUser(data)
            .then((res) => {
                console.log('Fetched chat user============================= response:', res);
                if (res && res.status === true) {
                    NavigationService.navigate('SingleChatScreen', {
                        chatData: res.data,
                        senderName: Rname
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching chat user:", error);
            });
    };


    const unseenMessage = userList?.unread_messages_count > 99 ? '99+' : userList?.unread_messages_count;

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loaderContainer}>

                    <FlatList
                        data={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, , 1, 1, 1, 1, 1]}
                        renderItem={({ item, index }) => (
                            <ShimmerLoader />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <View style={{ ...styles.Main_list_view, backgroundColor: colors.primaryFontColor }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {userList.length > 0 ? (
                            userList.map((item, index) => (
                                // <ChatListCard key={item.id || index} item={item} index={index} />
                                <TouchableOpacity
                                key={index}
                                onPress={() => getChatWith(item?.receiver_id, item?.receiver_name)}
                                style={{ ...styles.chatcontainer, backgroundColor: colors.secondaryThemeColor }}>
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
                            ))
                        ) : (
                            <View style={styles.noDataView}>
                                <Image source={require('../../assets/images/nodata.png')} style={styles.nodataImg} />
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 0,
         backgroundColor:'#fff'
    },
    noDataView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
        marginTop: moderateScale(100),
        flex:1,
        backgroundColor:'#fff'
    },
    nodataImg: {
        height: moderateScale(100),
        width: moderateScale(100),
        tintColor: 'green'
    },

    chatcontainer: {
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
export default MyChat;
