
//import liraries
import React, { Component, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import WishlistCard from '../../Components/DrawerCard/WishlistCard';
import HomeService from '../../Services/HomeServises';
import { Image } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// create a component
const MyWishlist = () => {
    const [wishList, setWishList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getWishList = useCallback(async () => {
        try {
            setLoading(true)
            const res = await HomeService.getWishListData()
            if (res && res.status === true) {
                setWishList(res.data)
            }
        } catch (err) {
            console.log('Error fetching wishlist:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            getWishList()
        }, [getWishList])
    );

    if (loading) {
        return <ActivityIndicator size="large" color="green" />;
    }

    return (
        <View style={styles.container}>
            <View>
                {wishList?.length > 0 ? (
                    <FlatList
                        data={wishList}
                        renderItem={({ item, index }) => (
                            <WishlistCard item={item} index={index} setWishList={setWishList} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View style={styles.noDataView}>
                        <Image source={require('../../assets/images/nodata.png')} style={styles.nodataImg} />
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
        marginHorizontal: 0
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
        tintColor: 'green'
    }
});

//make this component available to the app
export default MyWishlist;
