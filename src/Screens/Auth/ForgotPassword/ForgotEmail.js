//import liraries
import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../../../Constants/Fonts';
import { moderateScale } from '../../../Constants/PixelRatio';
import { AppButton, Card, useTheme } from 'react-native-basic-elements';
import { useRoute } from '@react-navigation/native';
import Toast from "react-native-simple-toast";
import { useDispatch } from 'react-redux';
import { TextInput } from 'react-native';
import Header from '../../../Components/Header/Header';
import NavigationService from '../../../Services/Navigation';
import AuthService from '../../../Services/Auth';


// create a component
const ForgotEmail = ({ navigation }) => {
  const dispatch = useDispatch()
  const colors = useTheme()
  const route = useRoute()

  const [email, setEmail] = useState('')
  const [btnLoader, setBtnLoader] = useState(false);

  const getForgotPassword = (() => {
      if (email === '') {
          Toast.show('Please enter Your Email');
          return;
      }
      let data = {
          "phone": email,
      };
      setBtnLoader(true);
      console.log('resssssssssssdataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', data);
      AuthService.getForgotPasswordEmail(data)
          .then((res) => {
            console.log('mxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx============',res);
              if (res && res.success == true) {
                  setBtnLoader(false);
                  Toast.show('An OTP has been sent to your verified email address.')
                  NavigationService.navigate('ForgotOTP',{getEmail:res?.data})      
              } else {
                  setBtnLoader(false);
                  Toast.show(res.message);
              }
          })
          .catch((err) => {
              console.log('emailverify==========================', err);
              setBtnLoader(false);
          });

  })


  return (
    <View style={styles.container}>
      <Header title='Verify-Email' />
      <Text style={{ ...styles.title_txt, color: colors.secondaryFontColor }}>Enter your Phone Number to set Password</Text>
      <Card style={{ ...styles.card_sty, backgroundColor: colors.cardColor }}>
        <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Enter Your Phone Number</Text>
        <View style={{ ...styles.phoneinput_view, borderColor: colors.borderColor }}>
          <TextInput
            style={{ ...styles.inputcontainer_sty, color: colors.secondaryFontColor }}
            keyboardType='phone-pad'
            placeholder='Phone Number'
            placeholderTextColor={colors.secondaryFontColor}
            value={email}
            onChangeText={(val) => setEmail(val)}
            maxLength={10}
          />
        </View>


        <AppButton
          textStyle={styles.buttn_txt}
          style={styles.button_sty}
          title="Cntinue"
          gradientStart={{ x: 0.3, y: 1 }}
          gradientEnd={{ x: 1, y: 1 }}
          gradient={true}
          gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
          onPress={() =>getForgotPassword()}
        loader={
            btnLoader
                ? {
                    position: "right",
                    color: "#fff",
                    size: "small",
                }
                : null
        }
        disabled={btnLoader}
        />
      </Card>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title_txt: {
    fontFamily: FONTS.Inter.bold,
    fontSize: moderateScale(14),
    marginHorizontal: moderateScale(15),
    marginTop: moderateScale(15),
    alignSelf:'center'
  },
  card_sty: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(15),
    paddingTop: moderateScale(25),
    paddingBottom: moderateScale(30),
    marginBottom: moderateScale(2)
},
  input_title: {
    fontSize: moderateScale(12),
    fontFamily: FONTS.Inter.semibold,

  },
  inputcontainer_sty: {
    height: moderateScale(45),
    width: moderateScale(250),
    borderWidth: 0,
    alignSelf: 'center',
    marginTop: moderateScale(-1),
    fontFamily: FONTS.Inter.medium,
    fontSize: moderateScale(12)
  },
  phoneinput_view: {
    height: moderateScale(45),
    borderRadius: moderateScale(7),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(7)
},
  text_input: {
    fontFamily: FONTS.Inter.medium,
    fontSize: moderateScale(12)
  },
  buttn_txt: {
    fontFamily: FONTS.Inter.medium,
    fontSize: moderateScale(15)
  },
  button_sty: {
    height: moderateScale(40),
    width: moderateScale(130),
    borderRadius: moderateScale(7),
    alignSelf: 'center',
    marginTop: moderateScale(20)
  },

});

//make this component available to the app
export default ForgotEmail;
