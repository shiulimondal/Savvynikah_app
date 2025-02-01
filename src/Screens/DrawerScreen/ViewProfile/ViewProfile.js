import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import SwiperFlatList from 'react-native-swiper-flatlist';
import { moderateScale } from '../../../Constants/PixelRatio';
import { useTheme } from 'react-native-basic-elements';
import PresonalInfoCard from '../../../Components/ProfileCard/PresonalInfoCard';
import PreferencesCard from '../../../Components/ProfileCard/PreferencesCard';
import ProfessionalInfoCard from '../../../Components/ProfileCard/ProfessionalInfoCard';
import { FONTS } from '../../../Constants/Fonts';
import { ScrollView } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import HomeService from '../../../Services/HomeServises';
import Modal from "react-native-modal";
import NavigationService from '../../../Services/Navigation';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import ImageViewing from 'react-native-image-viewing';


const { height, width } = Dimensions.get('screen');

const ViewProfile = () => {
    const { userData } = useSelector(state => state.User)
    const [selectScreen, setSelectScreen] = useState('Presonal Info');
    const colors = useTheme();
    const route = useRoute()
    const profileid = route.params.userId;
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userProfileData, setUserProfileData] = useState([])

    const [imageIndex, setImageIndex] = useState(0);

    const images = userProfileData?.profile_images?.map(img => ({ uri: img.url })) || [];

 const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    const renderContentScreen = () => {
        switch (selectScreen) {
            case 'Presonal Info':
                return <PresonalInfoCard userProfileData={userProfileData} />;
            case 'Preferences':
                return <PreferencesCard userProfileData={userProfileData} />;
            case 'Professional Info':
                return <ProfessionalInfoCard userProfileData={userProfileData} />;
            default:
                return null;
        }
    };

    useFocusEffect(
        useCallback(() => {
            getUserData();
            return () => {
            };
        }, [profileid])
    );

    const getUserData = () => {
        let data = {
            "user_id": profileid
        };
        setLoading(true);
        HomeService.getuserFullData(data)
            .then((res) => {
                console.log('uuuuuuuuuuuuuuuuuu-------------------------------------------', JSON.stringify(res));

                if (res && res.success === true) {
                    if (res.data) {
                        setUserProfileData(res.data);
                        setLoading(false);
                    } else {
                        console.log('Data not found.');
                        setLoading(false);
                    }
                } else if (res && res.status === false) {
                    setModalVisible(true);
                    setLoading(false);
                } else {
                    console.log('Something went wrong in the response');
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.log('getUserData-====', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const getChatWith = (() => {
        let data = {
            "user_id": userProfileData?.id
        }
        HomeService.setChatUser(data)
            .then((res) => {
                if (res && res.status == true) {
                    NavigationService.navigate('SingleChatScreen',
                        { chatData: res.data, senderName: userProfileData?.full_name })
                }

            })
    })

    return (
        <View style={styles.container}>

            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="green" />
                </View>
            ) : (
                <>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View style={{ height: height / 4.2 }}>
                            {
                                userProfileData?.profile_images?.length === 1 ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            setImageIndex(0);
                                            setVisible(true);
                                        }}
                                        activeOpacity={0.9}
                                    >
                                        <View style={{ height: height / 2.7,alignItems:'center' }}>
                                            <Image source={{ uri: userProfileData?.profile_images[0]?.url }} style={styles.bannerImg} />
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <SwiperFlatList
                                        showPagination
                                        autoplay
                                        autoplayDelay={3}
                                        autoplayLoop
                                        paginationStyle={styles.paginationStyle}
                                        paginationStyleItemActive={{
                                            ...styles.paginationItem,
                                            backgroundColor: colors.buttonColor,
                                        }}
                                        paginationStyleItemInactive={{
                                            ...styles.paginationItem,
                                            backgroundColor: colors.shadowColor,
                                        }}
                                        data={userProfileData?.profile_images}
                                        renderItem={({ item, index }) => (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setImageIndex(index);
                                                    setVisible(true);
                                                }}
                                                activeOpacity={0.9}
                                            >
                                                <View style={{ height: height / 2.7 }}>
                                                    <Image source={{ uri: item.url }} style={styles.bannerImg} />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                            }

                        </View>
                        <View style={[styles.tabView, { backgroundColor: colors.shadowColor }]}>
                            {['Presonal Info', 'Preferences', 'Professional Info'].map((screen) => (
                                <Pressable
                                    key={screen}
                                    style={[
                                        styles.tabScreenView,
                                        { backgroundColor: selectScreen === screen ? colors.buttonColor : colors.shadowColor },
                                    ]}
                                    onPress={() => setSelectScreen(screen)}
                                >
                                    <Text
                                        style={[
                                            styles.screenText,
                                            { color: selectScreen === screen ? colors.primaryFontColor : colors.secondaryFontColor },
                                        ]}
                                    >
                                        {screen}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                        {renderContentScreen()}
                    </ScrollView>

                    <TouchableOpacity onPress={() => getChatWith()}

                        style={styles.chat_circle}
                    >
                        <Image source={require('../../../assets/images/messenger.png')} style={styles.chat_img} />
                    </TouchableOpacity>

                </>
            )}



            <Modal
                isVisible={isModalVisible}
                backdropOpacity={3}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.modalView}>
                    <Text style={{ ...styles.subcstitle_txt, color: colors.secondaryFontColor }}>Buy A Subscription Plan</Text>
                    <Text style={{ ...styles.subcs_txt, color: colors.second_txt }}>You have Purchase a subscription plan to view the profile.</Text>

                    <TouchableOpacity
                        onPress={() => {
                            NavigationService.navigate('GetPremium'), setModalVisible(false)
                        }}
                        style={{ ...styles.save_btn, backgroundColor: colors.buttonColor }}>
                        <Text style={{ ...styles.canclebtn_txt, color: colors.primaryFontColor }}>OK</Text>
                    </TouchableOpacity>
                </View>
            </Modal>


            <ImageViewing
                images={images}
                imageIndex={imageIndex}
                visible={visible}
                onRequestClose={() => setVisible(false)}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerImg: {
        height: moderateScale(170),
        width: width - moderateScale(30),
        borderRadius: moderateScale(20),
        marginTop: moderateScale(10),
        resizeMode: 'cover',
        marginRight: moderateScale(10),
    },
    tabView: {
        flexDirection: 'row',
        marginHorizontal: moderateScale(10),
        marginTop: moderateScale(15),
        // padding: moderateScale(3),
        borderRadius: moderateScale(20),
        justifyContent: 'space-between',
        marginBottom: moderateScale(15)
    },
    tabScreenView: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        borderRadius: moderateScale(20),
        paddingHorizontal: moderateScale(10),
    },
    screenText: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(13),
    },
    paginationStyle: {
        bottom: moderateScale(0),
    },
    paginationItem: {
        height: moderateScale(6),
        width: moderateScale(6),
        borderRadius: moderateScale(7),
        marginHorizontal: moderateScale(3),
    },
    modalView: {
        height: moderateScale(180),
        width: '80%',
        backgroundColor: 'white',
        borderRadius: moderateScale(15),
        padding: moderateScale(10)
    },
    subcstitle_txt: {
        textAlign: 'center',
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(17),
        marginTop: moderateScale(15)
    },
    subcs_txt: {
        textAlign: 'center',
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12),
        marginTop: moderateScale(12)
    },
    save_btn: {
        height: moderateScale(40),
        width: moderateScale(80),
        borderRadius: moderateScale(7),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: moderateScale(30)
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(30)
    },
    chat_circle: {
        height: moderateScale(44),
        width: moderateScale(44),
        borderRadius: moderateScale(20),
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 60,
        right: 40,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 15
    },
    chat_img: {
        height: moderateScale(26),
        width: moderateScale(26),
        tintColor: 'green'
    }
});

export default ViewProfile;
