//import liraries
import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Pressable, Animated, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import HomeHeader from '../../Components/Header/HomeHeader';
import { Image } from 'react-native';
import { ImageBackground } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { useTheme } from 'react-native-basic-elements';
import ProfileListCard from '../../Components/HomeCard/ProfileListCard';
import Modal from "react-native-modal";
import FilterCard from '../../Components/HomeCard/FilterCard';
import { useSelector } from 'react-redux';
import HomeService from '../../Services/HomeServises';

const { height, width } = Dimensions.get('screen')
const Home = () => {
    const { userData } = useSelector(state => state.User)
    // console.log('userdata---------------home--------------------', userData);
    const [loading, setLoading] = useState(true);
    const colors = useTheme();
    const [isModalVisible, setModalVisible] = useState(false);
    const modalAnimation = useRef(new Animated.Value(0)).current;

    const toggleModal = () => {
        setModalVisible(!isModalVisible);

        Animated.timing(modalAnimation, {
            toValue: isModalVisible ? 1 : 2,
            duration: 0.10,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        getUsetData()
    }, [])

    const [filterData, setFilterData] = useState(null);
    const [ProfileListData, setProfileListData] = useState([]);
    console.log('profffffffffffffffffffffffffffffff', ProfileListData);


    const handleFilterData = (data) => {
        setFilterData(data);
        setModalVisible(false);
    };

    const getUsetData = (() => {
        let data = {
            "gender": filterData?.gender ?? null,
            "marital_status": filterData?.marital_status ?? null,
            "education_id": filterData?.education_id ?? null,
            "occupation_id": filterData?.occupation_id ?? null,
            "min_height": filterData?.min_height ?? null,
            "max_height": filterData?.max_height ?? null,
            "min_age": filterData?.min_age ?? null,
            "max_age": filterData?.max_age ?? null,
            "caste": filterData?.caste ?? null
        };
        console.log('filllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll+++++++++++++++++++++++++++', data);

        HomeService.getuserListNdFilterData(data)
            .then((res) => {
                console.log('gettttttttttttttttttttttttttttttttttttttttttttttt0000000000000000000000000ttttt', JSON.stringify(res));
                if (res && res.success == true) {
                    setProfileListData(res.data)
                }
            })
            .catch((err) => {
                console.log('errrrrhomrlist', err);

            })
            .finally(() => {
                setLoading(false);
            });
    })




    return (
        <View style={styles.container}>
        {/* <HomeHeader /> */}
        <ImageBackground
            source={require('../../assets/images/homeBannerBack.jpg')}
            style={styles.Homebanner_img}>
            <View style={styles.main_view}>
                <Text style={{ ...styles.title_txt, color: colors.primaryFontColor }}>Find Your Best Partner</Text>
            </View>
        </ImageBackground>
        <View style={{ ...styles.secondary_view, backgroundColor: colors.second_txt, flex: 1 }}>
            <View style={styles.search_view}>
                <Text style={{ ...styles.search_txt, color: colors.primaryFontColor }}>search For Partner</Text>
                <Pressable onPress={toggleModal} style={styles.filter_view}>
                    <Image source={require('../../assets/images/filter.png')} style={styles.filter_img} />
                </Pressable>
            </View>
    
            {loading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            ) : (
                <View style={{ flex: 1,backgroundColor:'#fff' }}>
                    {ProfileListData?.length > 0 ? (
                        <FlatList
                            data={ProfileListData}
                            renderItem={({ item, index }) => <ProfileListCard item={item} index={index} />}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 20 }} 
                        />
                    ) : (
                        <View style={styles.noDataView}>
                            <Image source={require('../../assets/images/nodata.png')} style={styles.nodataImg} />
                        </View>
                    )}
                </View>
            )}
        </View>
    
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            onBackButtonPress={() => setModalVisible(false)}
            animationIn="slideInDown"
            animationOut="slideOutUp"
            backdropOpacity={0.5}
            style={{ margin: 0, justifyContent: 'flex-end', marginTop: 0 }}
        >
            <View style={{ ...styles.modalView, backgroundColor: colors.buttonColor }}>
                <Text style={{ ...styles.filter_title, color: colors.primaryFontColor }}>Filter by Your Preferences</Text>
                <FilterCard setModalVisible={setModalVisible} onSaveFilter={handleFilterData} />
            </View>
        </Modal>
    </View>
    
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Homebanner_img: {
        height: height / 3.3,
        width: width
    },
    main_view: {
        height: height / 3.3,
        width: width,
        backgroundColor: 'rgba(2, 21, 38,0.7)'
    },
    Main_list_view: {
        height: height,
        width: width,
        marginTop: moderateScale(15),
        borderTopLeftRadius: moderateScale(13),
        borderTopRightRadius: moderateScale(13)
    },
    title_txt: {
        fontFamily: FONTS.Inter.bold,
        fontSize: moderateScale(25),
        marginTop: moderateScale(50),
        marginHorizontal: moderateScale(15),
        maxWidth: '60%',
    },
    secondary_view: {
        height: height,
        width: width,
        marginTop: moderateScale(-100),
        borderTopLeftRadius: moderateScale(13),
        borderTopRightRadius: moderateScale(13),
    },
    search_view: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: moderateScale(15),
        alignItems: 'center',
        marginTop: moderateScale(15),
        paddingBottom:moderateScale(10)
    },
    filter_view: {
        height: moderateScale(25),
        width: moderateScale(25),
        borderRadius: moderateScale(4),
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    filter_img: {
        height: moderateScale(20),
        width: moderateScale(20)
    },
    search_txt: {
        fontFamily: FONTS.Inter.bold,
        fontSize: moderateScale(14)
    },
    modalView: {
        padding: moderateScale(15),
        alignSelf: 'center',
        height: height / 1.3,
        width: width,
        borderTopLeftRadius: moderateScale(20),
        borderTopRightRadius: moderateScale(20)
    },
    filter_title: {
        fontFamily: FONTS.Inter.bold,
        fontSize: moderateScale(14),
        textAlign: 'center'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: moderateScale(30)
    },
    noDataView: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: moderateScale(20),
        marginTop: moderateScale(100)
    },
    noDataText: {
        fontSize: moderateScale(15),
        fontFamily: FONTS.Inter.bold,
    },
    nodataImg: {
        height: moderateScale(100),
        width: moderateScale(100),
        // tintColor: 'green'z
    }
});

//make this component available to the app
export default Home;
