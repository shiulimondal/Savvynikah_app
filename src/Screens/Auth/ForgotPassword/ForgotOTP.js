//import liraries
import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../../Components/Header/Header';
import { FONTS } from '../../../Constants/Fonts';
import { moderateScale } from '../../../Constants/PixelRatio';
import { AppButton, useTheme } from 'react-native-basic-elements';
import OTPTextInput from 'react-native-otp-textinput';
import AuthService from '../../../Services/Auth';
import { useRoute } from '@react-navigation/native';
import Toast from "react-native-simple-toast";
import NavigationService from '../../../Services/Navigation';


// create a component
const ForgotOTP = ({ navigation }) => {
    const colors = useTheme()
    const route = useRoute()
    const RegAllData = route.params.getEmail
    // console.log('reddddddddddddddddddddddddddddddd', RegAllData);
    const [btnLoader, setBtnLoader] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [emailOtp, setEmailOtp] = useState('')
    const timerRef = useRef();

    useEffect(() => {
        startTimer();

        return () => clearInterval(timerRef.current);
    }, []);

    const startTimer = () => {
        setCanResend(false);
        setTimer(60);

        timerRef.current = setInterval(() => {
            setTimer((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerRef.current);
                    setCanResend(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    const getEmailVerify = (() => {
        let data = {
            "phone": RegAllData,
            "otp": emailOtp
        }
        // console.log('otpdaaaaaaaaaaaaaaaa',data);
        setBtnLoader(true)
        AuthService.getForgotPasswordOTP(data)
            .then((res) => {
                console.log('veriiiiiiiiiiiiiiiiiiiiiiiiiiii',res);
                if (res && res.success == true) {
                    setBtnLoader(false)
                    Toast.show(res.message)
                    NavigationService.navigate('SetPassword', { OTPData: res?.data })
                } else {
                    setBtnLoader(false)
                    Toast.show(res.message)
                }
            })
            .catch((err) => {
                console.log('emailverify', err);
                setBtnLoader(false)
            });

    })

    const resendOtp = () => {
        let data = { "phone":  RegAllData };
        AuthService.getForgotPasswordEmail(data)
            .then((res) => {
                Toast.show('OTP resent successfully!');
                startTimer();
            })
            .catch((err) => {
                Toast.show('Error in resending OTP!');
            });
    };

    return (
        <View style={styles.container}>
            <Header title='Mobile-Verify' />
            <Text style={{ ...styles.title_txt, color: colors.secondaryFontColor }}>Enter the Code sent to your Phone Number</Text>
            <Text style={{ ...styles.otp_txt, color: colors.second_txt }}>We've send the OTP to {RegAllData}</Text>
            <View style={{ marginHorizontal: moderateScale(15), marginTop: moderateScale(15) }}>
                <OTPTextInput
                    inputCount={6}
                    handleTextChange={(text) => setEmailOtp(text)}
                    defaultValue={emailOtp}
                    textInputStyle={{ ...styles.otp_sty }}
                />
            </View>
            {emailOtp.length === 6 ? (
                <AppButton
                    textStyle={styles.buttn_txt}
                    style={styles.button_sty}
                    title="Continue"
                    gradientStart={{ x: 0.3, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    gradient={true}
                    gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
                    onPress={() => getEmailVerify()}
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
            ) : (
                <AppButton
                    textStyle={styles.buttn_txt}
                    style={{ ...styles.button_sty, backgroundColor: 'gray' }}
                    title="Continue"

                />
            )}

            {canResend ? (
                <Text style={{ ...styles.resend_txt, color: colors.second_txt }} onPress={resendOtp}>
                    Resend OTP
                </Text>
            ) : (
                <Text style={{ ...styles.timer_txt, color: colors.secondaryFontColor }}>
                    Resend OTP in {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
                </Text>
            )}
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
        marginTop: moderateScale(15)
    },
    otp_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(5)
    },
    otp_sty: {
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: moderateScale(4),
        width: moderateScale(42),
        height: moderateScale(45),
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(15)
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
    resend_txt: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(13),
        textAlign: 'center',
        marginTop: moderateScale(15)
    },
    timer_txt: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(13),
        textAlign: 'center',
        marginTop: moderateScale(15)
    }
});

//make this component available to the app
export default ForgotOTP;
