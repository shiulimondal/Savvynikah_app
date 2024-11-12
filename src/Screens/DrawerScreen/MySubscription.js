//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Image } from 'react-native';
import SubscriptionCard from '../../Components/DrawerCard/SubscriptionCard';
import HomeService from '../../Services/HomeServises';
import MySubscriptionPlanCard from '../../Components/DrawerCard/MySubscriptionPlanCard';
import { moderateScale } from '../../Constants/PixelRatio';

// create a component
const MySubscription = () => {
    const [subPlanDetails, setSubPlanDetails] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSubPlanData()
    }, [])

    const getSubPlanData = () => {
        HomeService.getMySubscriptionPlans()
            .then((res) => {
                console.log('ddddddsssssssssssssssssss00000000000=====================', res);
                if (res && res.success == true) {
                    setSubPlanDetails(res.data)
                }
            })
            .catch((err) => {
                console.log('homeerrr', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <View style={styles.container}>

            <View>
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="green" />
                    </View>
                ) : (
                    <View>

                        {
                            subPlanDetails?.length > 0 ?
                                <FlatList
                                    data={subPlanDetails}
                                    renderItem={({ item, index }) => (
                                        <MySubscriptionPlanCard item={item} index={index} />
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                    showsVerticalScrollIndicator={false}
                                />
                                :
                                <View style={styles.noDataView}>
                                    <Image source={require('../../assets/images/nodata.png')} style={styles.nodataImg} />
                                </View>
                        }


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
    nodataImg: {
        height: moderateScale(100),
        width: moderateScale(100),
        tintColor: 'green'
    }
});

//make this component available to the app
export default MySubscription;
