//import liraries
import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../Components/Header/Header';
import { FONTS } from '../../Constants/Fonts';
import { moderateScale } from '../../Constants/PixelRatio';
import { AppButton, useTheme } from 'react-native-basic-elements';
import OTPTextInput from 'react-native-otp-textinput';
import AuthService from '../../Services/Auth';
import { useRoute } from '@react-navigation/native';
import Toast from "react-native-simple-toast";
import NavigationService from '../../Services/Navigation';


// create a component
const EmailVerify = ({ navigation }) => {
    const colors = useTheme()
    const route = useRoute()
    const RegAllData = route.params.regData
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

    const getEmailVerify = () => {
        const data = {
            phone: RegAllData?.phone,
            otp: emailOtp
        };
        console.log('Sending OTP data:', data);
    
        setBtnLoader(true);
    
        AuthService.getEmailOTP(data)
            .then((res) => {
                console.log('Verification response:', res);
                setBtnLoader(false);
    
                if (res && res.status === true) {
                    Toast.show(res.message);
                    AuthService.setToken(res.token);
                    navigation.navigate('Presonal_Info', { signupData: res });
                } else {
                    Toast.show('Incorrect OTP');
                }
            })
            .catch((err) => {
                console.error('Verification error:===============================', err);
                Toast.show('An error occurred during verification');
                setBtnLoader(false);
            });
    };
    

    const resendOtp = () => {
        let data = { "phone":  RegAllData?.phone };
        AuthService.getVerifyResendOTP(data)
            .then((res) => {
                Toast.show('OTP resent successfully!');
                startTimer();
                setEmailOtp('')
            })
            .catch((err) => {
                Toast.show('Error in resending OTP!');
            });
    };

    return (
        <View style={styles.container}>
            <Header title='Mobile-Verify' />
            <Text style={{ ...styles.title_txt, color: colors.secondaryFontColor }}>Enter the OTP sent to your Phone Number</Text>
            <Text style={{ ...styles.otp_txt, color: colors.second_txt }}>We've send the OTP to {RegAllData?.phone}</Text>
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
                    style={{...styles.button_sty,backgroundColor:'gray'}}
                    title="Continue"
                   
                />
            )}

            {canResend ? (
                <Text style={{ ...styles.resend_txt, color: colors.second_txt }}
                onPress={resendOtp}
                >
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
export default EmailVerify;
