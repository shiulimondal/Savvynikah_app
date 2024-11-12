//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { AppButton, Icon, useTheme } from 'react-native-basic-elements';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';
import HomeService from '../../Services/HomeServises';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileListCard = ({ item, index }) => {
  // console.log('singggggggggggggggggggggggggggggggggggggggggggggprofileeeeeeeeeeeeee',item);
  const colors = useTheme();
  const [isInWishlist, setIsInWishlist] = useState(item.flag === 1);

  useEffect(() => {
    setIsInWishlist(item.flag === 1);
  }, [item.flag]);
  

  const toggleWishList = () => {
    const data = { "user_id": item.id };
  
    if (isInWishlist) {
      HomeService.getRemoveWislit(data)
        .then((res) => {
          console.log('Removed from wishlist', res);
          setIsInWishlist(false); 
        })
        .catch((err) => {
          console.log('Error removing from wishlist', err);
        });
    } else {
      HomeService.getAddWislit(data)
        .then((res) => {
          console.log('Added to wishlist', res);
          setIsInWishlist(true); 
        })
        .catch((err) => {
          console.log('Error adding to wishlist', err);
        });
    }
  };

  
  return (
    <View key={index} style={{ ...styles.container, backgroundColor: colors.primaryFontColor }}>
      <View style={{
        position: 'absolute',
        right: moderateScale(8),
        top: moderateScale(7)
      }}>

        <Icon
          name={isInWishlist ? 'heart' : 'hearto'} 
          type='AntDesign'
          color={'red'}
          size={12}
          onPress={toggleWishList} 
        />

      </View>

      <Image
        source={item?.profile_images?.length > 0 && item.profile_images[0]?.url ?
          { uri: item.profile_images[0].url } :
          require('../../assets/images/user.png')}
        style={styles.user_img}
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: moderateScale(7),
        flex: 1
      }}>
        <View>
          <Text style={styles.usr_name}>{item.name || 'Unknown'}</Text>
          {item?.occupation?.name ? (
            <Text style={styles.occupation}>{item?.occupation?.name || 'Not specified'}</Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'center' }}>
          {item.age ? (
            <Text style={{ ...styles.usr_name, color: colors.buttonColor }}>
              {item.age} <Text style={styles.occupation}>Years</Text>
            </Text>
          ) : null}
          <AppButton
            textStyle={styles.buttn_txt}
            style={styles.button_sty}
            title="View Profile"
            gradientStart={{ x: 0.3, y: 1 }}
            gradientEnd={{ x: 1, y: 1 }}
            gradient={true}
            gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
            onPress={() => NavigationService.navigate('ViewProfile', { userId: item.id })}
          />
        </View>
      </View>
    </View>
  );
};


// define your styles
const styles = StyleSheet.create({
  container: {
    padding: moderateScale(10),
    marginHorizontal: moderateScale(15),
    marginTop: moderateScale(10),
    borderRadius: moderateScale(7),
    elevation: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  user_img: {
    height: moderateScale(60),
    width: moderateScale(60),
    borderRadius: moderateScale(40)
  },
  usr_name: {
    fontFamily: FONTS.Inter.bold,
    fontSize: moderateScale(13),
    color: '#000'
  },
  occupation: {
    fontFamily: FONTS.Inter.regular,
    fontSize: moderateScale(10),
    color: '#000'
  },
  buttn_txt: {
    fontFamily: FONTS.Inter.medium,
    fontSize: moderateScale(10)
  },
  button_sty: {
    height: moderateScale(26),
    width: moderateScale(80),
    borderRadius: moderateScale(7),
    marginHorizontal: 0,
    marginTop: moderateScale(5)
  },
});

//make this component available to the app
export default ProfileListCard;
