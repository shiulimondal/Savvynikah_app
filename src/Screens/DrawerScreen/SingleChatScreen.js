// Import libraries
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { GiftedChat, Send, Bubble, Composer } from 'react-native-gifted-chat';
import { Icon, useTheme } from 'react-native-basic-elements';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import { Image } from 'react-native';


const SingleChatScreen = () => {
    const colors = useTheme();
    const route = useRoute()
    const chatUserData = route.params.userIdData;
    const MyChatId = route.params.MyId;
    const MyChatname = route.params.Myname;

    console.log("MyChatId=========================", MyChatId);
    console.log("chatUserData.id:==============================", chatUserData?.id);


    const [messagesList, setMessages] = useState([]);

    useEffect(() => {
        const chatId = `${MyChatId}-${ chatUserData.id}`;
        console.log("chatId:===================", chatId);
        console.log("userId:=====================", MyChatId, "recipientId:",  chatUserData.id); 

        const unsubscribe = firestore()
            .collection('Chats')
            .doc(chatId)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot((querySnapshot) => {
                const messagesFirestore = querySnapshot.docs.map(doc => {
                    const firebaseData = doc.data();
                    console.log("Message from Firestore:====================55555555555555555555", firebaseData); 

                    const data = {
                        _id: doc.id,
                        text: firebaseData.text,
                        createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
                        user: firebaseData.user,
                    };
    
                    return data;
                });
    
                setMessages(messagesFirestore);
            }, (error) => console.error("onSnapshot error:", error));
    
        return () => unsubscribe();
    }, [MyChatId,  chatUserData.id]);
    

    const onSend = useCallback((newMessages = []) => {
        const text = newMessages[0]?.text;
        const chatId = `${MyChatId}-${ chatUserData.id}`;
        
        console.log("Sending message:====================", text); 
        
        if (text) {
            firestore()
                .collection('Chats')
                .doc(chatId)
                .collection('Messages')
                .add({
                    text,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    user: {
                        _id: MyChatId,
                        name: MyChatname,
                    },
                })
                .catch((error) => console.error("Error adding message:", error));
        }

        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    }, [MyChatId,  chatUserData.id, MyChatname]);


    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: colors.senderView,
                    },
                    left: {
                        backgroundColor: colors.secondaryThemeColor,
                    },
                }}
                textStyle={{
                    right: {
                        color: '#000',
                        fontFamily: FONTS.Inter.regular,
                        fontSize: moderateScale(13),
                    },
                    left: {
                        color: '#000',
                        fontFamily: FONTS.Inter.regular,
                        fontSize: moderateScale(13),
                    },
                }}
            />
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.chatScreen }]}>
            <GiftedChat
                messages={messagesList}
                onSend={(val) => onSend(val)}
                user={{ _id: MyChatId }}
                renderBubble={renderBubble}
                renderSend={(props) => (
                    <Send {...props}>
                        <View style={styles.sendButton}>
                            <Image source={Image.resolveAssetSource(require('../../assets/images/send.png'))} style={styles.sendimg} />
                        </View>
                    </Send>
                )}
                placeholder="Message"
                textInputStyle={{
                    color: colors.secondaryFontColor,
                    backgroundColor: colors.secondaryThemeColor,
                    borderRadius: moderateScale(25),
                    paddingLeft: moderateScale(10),
                    fontSize: moderateScale(14),
                }}
                alwaysShowSend={true}
                renderComposer={(props) => (
                    <Composer
                        {...props}
                        textInputStyle={{
                            color: colors.secondaryFontColor, 
                            backgroundColor: colors.secondaryThemeColor,
                            borderRadius: moderateScale(25),
                            paddingLeft: moderateScale(10),
                            fontSize: moderateScale(14),
                        }}
                    />
                )}
                showUserAvatar
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sendButton: {
        height: moderateScale(36),
        width: moderateScale(36),
        borderRadius: moderateScale(18),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: moderateScale(5),
        backgroundColor: 'green',
        marginBottom: moderateScale(4),
    },
    sendimg: {
        height: moderateScale(20),
        width: moderateScale(20),
        tintColor:'#fff'
    }
});

export default SingleChatScreen;
