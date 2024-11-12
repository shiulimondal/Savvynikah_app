//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ChatListCard from '../../Components/DrawerCard/ChatListCard';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import HomeService from '../../Services/HomeServises';
import { useTheme } from 'react-native-basic-elements';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const MyChat = () => {
    const colors = useTheme();
    const [loading, setLoading] = useState(true);
    const [ProfileListData, setProfileListData] = useState([]);
    const { userData } = useSelector(state => state.User); 


    useFocusEffect(
        useCallback(() => {
            getUserData();
          return () => {
          };
        }, [ProfileListData])
      );

    const getUserData = async () => {
        const data = {
            gender: null,
            marital_status: null,
            education_id: null,
            occupation_id: null,
            min_height: null,
            max_height: null,
            min_age: null,
            max_age: null,
            caste: null,
        };

        try {
            const res = await HomeService.getuserListNdFilterData(data);
            if (res?.success) {
                const users = res.data;
                const usersWithLastMessage = await fetchLastMessages(users);
                setProfileListData(usersWithLastMessage);
            } else {
                console.error("Data fetch unsuccessful");
            }
        } catch (err) {
            console.log('Error fetching user list:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLastMessages = async (users) => {
        const updatedUsers = await Promise.all(users.map(async (user) => {
            const chatId = `${userData.id}-${user.id}`;
            try {
                const lastMessageSnapshot = await firestore()
                    .collection('Chats')
                    .doc(chatId)
                    .collection('Messages')
                    .orderBy('createdAt', 'desc')
                    .limit(1)
                    .get();

                const lastMessage = lastMessageSnapshot.docs[0]?.data();
                return { ...user, lastMessageText: lastMessage?.text || '' };
            } catch (error) {
                console.error(`Error fetching last message for ${chatId}:`, error);
                return { ...user, lastMessageText: '' };
            }
        }));
        return updatedUsers;
    };

    return (
        <View style={styles.container}>
            <View>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <View>
                        {ProfileListData?.length > 0 ? (
                            <View style={{ ...styles.Main_list_view, backgroundColor: colors.primaryFontColor }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {ProfileListData.map((item, index) => (
                                        <ChatListCard key={item.id || index} item={item} index={index} />
                                    ))}
                                </ScrollView>
                            </View>
                        ) : (
                            <View style={styles.noDataView}>
                                <Image source={require('../../assets/images/nodata.png')} style={styles.nodataImg} />
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
};
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal:0
    },
    noDataView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
        marginTop: moderateScale(100)
    },

    nodataImg: {
        height: moderateScale(100),
        width: moderateScale(100),
        tintColor: 'green'
    }
});

//make this component available to the app
export default MyChat;
