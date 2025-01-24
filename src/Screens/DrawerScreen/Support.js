//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image, ActivityIndicator } from 'react-native';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import HomeService from '../../Services/HomeServises';
import { useSelector } from 'react-redux';
import { Icon } from 'react-native-basic-elements';
import Toast from "react-native-simple-toast";

// create a component
const Support = () => {
  const { userData } = useSelector(state => state.User);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    FetchSetting();
  }, []);

  const FetchSetting = () => {
    setLoading(true);
    HomeService.setSettingsData()
      .then(res => {
        console.log('Settings fetched:', res);
        if (res && res.success == true) {
          setSettings(res.data);
        }
      })
      .catch(err => {
        console.log('Settings fetch error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePhonePress = (phoneNumber) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`).catch(err =>
        console.log('Error', 'Unable to open dialer')
      );
    } else {
      Toast.show('Phone number not available')
    }
  };

  const handleEmailPress = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`).catch(err =>
        console.log('Error', 'Unable to open email client')
      );
    } else {
      Toast.show('Email Id not available')
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#15D704" style={styles.loader} />
      ) : settings != null ? (
        <>
          <TouchableOpacity
            onPress={() => handlePhonePress(settings?.phone)}
            style={styles.contact_view}>
            <View style={{ flexDirection: 'row' }}>
              {/* <Icon name='smartphone' type='Feather' size={18} color="#15D704" /> */}

              <Image source={require('../../assets/images/call.png')} style={styles.icon_img} />
              <Text style={styles.phnumber_txt}>
                +91 {settings?.phone}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handlePhonePress(settings?.phone)}>
              <Icon name='right' type='AntDesign' color={'#000'} />
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleEmailPress(settings?.email)}
            style={styles.contact_view}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={require('../../assets/images/email.png')} style={styles.icon_img} />
              <Text style={styles.phnumber_txt}>{settings?.email}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEmailPress(settings?.email)}>
              <Icon name='right' type='AntDesign' color={'#000'} />
            </TouchableOpacity>
          </TouchableOpacity>
        </>
      ) : null}


    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: moderateScale(20),
  },
  contact_view: {
    padding: moderateScale(10),
    marginHorizontal: moderateScale(10),
    elevation: 4,
    marginTop: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(20),
  },
  phnumber_txt: {
    fontFamily: FONTS.Inter.medium,
    fontSize: moderateScale(13),
    color: '#000',
    marginLeft: moderateScale(10),
  },
  icon_img: {
    height: moderateScale(25),
    width: moderateScale(25),
    resizeMode: 'contain'
  }
});

export default Support;
