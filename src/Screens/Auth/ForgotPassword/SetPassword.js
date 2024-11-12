//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { AppButton, AppTextInput, Icon, useTheme } from 'react-native-basic-elements';
import { moderateScale } from '../../../Constants/PixelRatio';
import { FONTS } from '../../../Constants/Fonts';
import Header from '../../../Components/Header/Header';
import NavigationService from '../../../Services/Navigation';
import { useRoute } from '@react-navigation/native';
import AuthService from '../../../Services/Auth';
import Toast from "react-native-simple-toast";

const { height, width } = Dimensions.get('screen');
// create a component
const SetPassword = () => {
    const colors = useTheme()
    const route = useRoute()
    const AllOTPData = route.params.OTPData
    console.log('redddddddddddddddddddddddddddddddooooo77777777777777777777', AllOTPData);
    const [btnLoader, setBtnLoader] = useState(false);
    const [password, setPassword] = useState('')
    const [cnfpassword, setCnfPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [CnfshowPassword, setCnfShowPassword] = useState(false);

    const getForgotPassword = (() => {
        let hasError = false;
        if (password === '') {
            Toast.show('Please enter password');
            hasError = true;
            return false
        } else if (password.length < 6) {
            Toast.show('Password must be at least 6 characters');

            hasError = true;
            return false
        }
        if (cnfpassword === '') {
            Toast.show('Please enter Confirm password');
            hasError = true;
            return false
        } else if (cnfpassword !== password) {
            Toast.show('Passwords do not match');

            hasError = true;
            return false
        }
        let data = {
            "phone": AllOTPData,
            "password": password,
            "password_confirmation": cnfpassword
        }
        // console.log('otpdaaaaaaaaaaaaaaaa',data);
        setBtnLoader(true)
        AuthService.getREsetForgotPassword(data)
            .then((res) => {
                console.log('veriiiiiiiiiiiiiiiiiiiiiiiiiiii',res);
                if (res && res.success == true) {
                    setBtnLoader(false)
                    Toast.show(res.message)
                    NavigationService.navigate('Login')
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
    return (
        <View style={styles.container}>
            <Header title='Forgot Password' />

            <Text style={{ ...styles.input_title, color: colors.light_txt }}>New Password</Text>
            <View style={{
                ...styles.PasswordInput_view, backgroundColor: colors.inputColor,
                borderColor: colors.borderColor
            }}>
                <TextInput
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                    placeholder='Password'
                    placeholderTextColor={colors.secondaryFontColor}
                    style={{ ...styles.passwordInputcontainer_sty, backgroundColor: colors.tintText, color: colors.secondaryFontColor }}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Icon
                        name={showPassword ? 'eye' : 'eye-off'}
                        type="Feather"
                        color={colors.secondaryFontColor}
                        size={18}
                    />
                </TouchableOpacity>
            </View>
            
            <Text style={{ ...styles.input_title, color: colors.light_txt }}>Confirm New Password</Text>
            <View style={{
                ...styles.PasswordInput_view, backgroundColor: colors.inputColor,
                borderColor: colors.borderColor
            }}>

                <TextInput
                    value={cnfpassword}
                    onChangeText={(val) => setCnfPassword(val)}
                    placeholder='Confirm Password'
                    placeholderTextColor={colors.secondaryFontColor}
                    style={{
                        ...styles.passwordInputcontainer_sty,
                        color: colors.secondaryFontColor,
                        backgroundColor: colors.tintText,
                    }}
                    secureTextEntry={!CnfshowPassword}
                />
                <TouchableOpacity onPress={() => setCnfShowPassword(!CnfshowPassword)}>
                    <Icon
                        name={CnfshowPassword ? 'eye' : 'eye-off'}
                        type="Feather"
                        color={colors.secondaryFontColor}
                        size={18}
                    />
                </TouchableOpacity>
            </View>

            <AppButton
                textStyle={styles.buttn_txt}
                style={styles.button_sty}
                title="Submit"
                gradientStart={{ x: 0.3, y: 1 }}
                gradientEnd={{ x: 1, y: 1 }}
                gradient={true}
                gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
                onPress={() => getForgotPassword()}
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
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    input_title: {
        fontSize: moderateScale(12),
        fontFamily: FONTS.Inter.semibold,
        marginTop: moderateScale(15),
        marginHorizontal: moderateScale(15)
    },
    inputcontainer_sty: {
        borderWidth: 0,
        alignSelf: 'center',
        height: moderateScale(45),
        borderRadius: moderateScale(5),
        borderWidth: 1,
        paddingLeft: moderateScale(7),
        marginHorizontal: moderateScale(15)
    },
    text_input: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12)
    },
    buttn_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(14)
    },
    button_sty: {
        height: moderateScale(42),
        width: moderateScale(180),
        borderRadius: moderateScale(7),
        alignSelf: 'center',
        marginTop: moderateScale(40)
    },
    passwordInputcontainer_sty: {
        alignSelf: 'center',
        height: moderateScale(45),
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
        width: moderateScale(280),
        borderRadius: moderateScale(10),
    },
    PasswordInput_view: {
        height: moderateScale(45),
        width: width - moderateScale(30),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        marginHorizontal: moderateScale(15),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(7),
        marginTop: moderateScale(7),
        borderWidth: 1,
    },
});

//make this component available to the app
export default SetPassword;
