import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { AppTextInput, Icon, useTheme } from 'react-native-basic-elements';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import ChatHeader from '../../Components/Header/ChatHeader';
import HomeService from '../../Services/HomeServises';
import { useSelector } from 'react-redux';
import ShimmerLoader from '../../ui/ShimmerLoader';

const SingleChatScreen = () => {
  const { userData } = useSelector(state => state.User);
  const colors = useTheme();
  const route = useRoute();
  const { chatData: ChatUsers, senderName: SenderUserName } = route.params;

  const [messageData, setMessageData] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const scrollViewRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const interval = setInterval(getChatDetails, 3000);
      return () => clearInterval(interval);
    }, [ChatUsers])
  );

  const getChatDetails = useCallback(() => {
    const data = { conversation_id: ChatUsers.id };
    HomeService.setChatDetails(data)
      .then(res => {
        if (res?.status) {
          setMessageData(res.data || []);
        } else {
          setMessageData([]);
        }
      })
      .catch(err => console.error('Error fetching chat details:', err))
      .finally(() => {
        setIsLoading(false);
        scrollToBottom();
      });
  }, [ChatUsers]);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const sendMessageHandler = () => {
    if (!sendMessage.trim()) return;

    const data = { conversation_id: ChatUsers?.id, message: sendMessage.trim() };
    HomeService.setSendMessage(data)
      .then(res => {
        if (res?.status) {
          setSendMessage('');
          getChatDetails();
        }
      })
      .catch(err => console.error('Error sending message:', err));
  };

  const renderMessage = useCallback(
    (item, isSender) => {
      const messageBoxStyle = isSender ? styles.senderMessageBox : styles.receiverMessageBox;
      const triangleStyle = isSender ? styles.senderTriangle : styles.receiverTriangle;
      const containerStyle = isSender ? styles.senderContainer : styles.receiverContainer;
      const userImage = isSender ? messageData.sender_image : messageData.receiver_image;

      return (
        <View style={containerStyle} key={item.id}>
          {!isSender && <Image source={{ uri: userImage }} style={styles.userImage} />}
          <View style={styles.messageContainer}>
            <View style={[styles.messageBox, messageBoxStyle]}>
              <View style={[styles.triangle, triangleStyle]} />
              <Text numberOfLines={6} style={styles.messageText}>
                {item.message_body}
              </Text>
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
          {isSender && <Image source={{ uri: userImage }} style={styles.userImage} />}
        </View>
      );
    },
    [messageData]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.chatScreen }]}>
      <ChatHeader title={SenderUserName} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => <ShimmerLoader key={index} style={styles.shimmerLoader} />)
        ) : (
          messageData?.messages?.map(item => renderMessage(item, item.user_id === userData.id))
        )}
      </ScrollView>
      <View style={[styles.inputBox, { backgroundColor: colors.chatScreen }]}>
        <AppTextInput
          inputContainerStyle={[styles.inputContainer, { backgroundColor: colors.secondaryThemeColor }]}
          inputStyle={[styles.textInput, { color: colors.secondaryFontColor }]}
          placeholder="Message"
          placeholderTextColor={colors.secondaryFontColor}
          value={sendMessage}
          onChangeText={setSendMessage}
        />
        <Pressable onPress={sendMessageHandler} style={[styles.sendButton, { backgroundColor: colors.second_txt }]}>
          <Icon name="send" type="Ionicon" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: moderateScale(70),
  },
  scrollContent: {
    paddingBottom: moderateScale(70),
  },
  shimmerLoader: {
    marginVertical: moderateScale(5),
  },
  inputBox: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(15),
  },
  inputContainer: {
    height: moderateScale(45),
    width: moderateScale(265),
    borderRadius: moderateScale(25),
    paddingLeft: moderateScale(7),
  },
  textInput: {
    fontFamily: FONTS.Inter.medium,
    fontSize: moderateScale(12),
  },
  sendButton: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: moderateScale(15),
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: moderateScale(5),
  },
  messageBox: {
    padding: moderateScale(10),
    width: moderateScale(230),
    borderRadius: moderateScale(5),
    position: 'relative',
  },
  messageText: {
    fontFamily: FONTS.Inter.regular,
    fontSize: moderateScale(13),
  },
  timeText: {
    position: 'absolute',
    bottom: moderateScale(5),
    right: moderateScale(5),
    fontSize: moderateScale(10),
    fontFamily: FONTS.Inter.medium,
  },
  senderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: moderateScale(5),
  },
  receiverContainer: {
    flexDirection: 'row',
    padding: moderateScale(5),
  },
  senderMessageBox: {
    backgroundColor: '#fff',
    marginRight: moderateScale(10),
  },
  receiverMessageBox: {
    backgroundColor: '#fff',
    marginLeft: moderateScale(10),
  },
  triangle: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
  },
  senderTriangle: {
    right: -moderateScale(13),
    borderRightWidth: moderateScale(15),
    borderTopWidth: moderateScale(7),
    borderBottomWidth: moderateScale(2),
    borderRightColor: '#fff',
  },
  receiverTriangle: {
    left: -moderateScale(13),
    borderLeftWidth: moderateScale(15),
    borderTopWidth: moderateScale(7),
    borderBottomWidth: moderateScale(2),
    borderLeftColor: '#fff',
  },
  userImage: {
    height: moderateScale(30),
    width: moderateScale(30),
    borderRadius: moderateScale(20),
    resizeMode: 'cover',
    marginHorizontal: moderateScale(10),
  },
});

export default SingleChatScreen;
