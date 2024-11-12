//import liraries
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { AppButton, AppTextInput, Card, CheckBox, Icon, useTheme } from 'react-native-basic-elements';
import Header from '../../Components/Header/Header';
import { Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import NavigationService from '../../Services/Navigation';
import AuthService from '../../Services/Auth';
import Toast from "react-native-simple-toast";
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';


const { height, width } = Dimensions.get('screen');
// create a component
const Signup = ({ navigation }) => {
    const colors = useTheme()
    const [check, setCheck] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [cnfpassword, setCnfPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [CnfshowPassword, setCnfShowPassword] = useState(false);
    const [btnLoader, setBtnLoader] = useState(false);


    const getsignup = () => {
        let hasError = false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;

        if (name === '') {
            Toast.show('Please enter Name');
            hasError = true;
        }

        if (phone === '') {
            Toast.show('Please enter Phone Number');
            hasError = true;
        } else if (!phoneRegex.test(phone)) {
            Toast.show('Please enter a valid Phone Number');
            hasError = true;
        }

        if (email === '') {
            Toast.show('Please enter Email Id');
            hasError = true;
        } else if (!emailRegex.test(email)) {
            Toast.show('Please enter a valid Email Id');
            hasError = true;
        }

        if (password === '') {
            Toast.show('Please enter Password');
            hasError = true;
            return false
        } else if (password.length < 6) {
            Toast.show('Password must be at least 6 characters');
            hasError = true;
            return false
        }

        if (cnfpassword === '') {
            Toast.show('Please confirm your Password');
            hasError = true;
            return false
        } else if (password !== cnfpassword) {
            Toast.show('Passwords do not match');
            hasError = true;
            return false
        }

        if (!check) {
            Toast.show('Please accept the terms and conditions before registering');
            hasError = true;
        }

        if (hasError) return false;

        const data = {
            name,
            email,
            phone,
            password,
        };
        setBtnLoader(true);
        console.log('Signup data:=============================', data);
        return AuthService.getregister(data)
            .then((res) => {
                console.log('Signup successful:', res);
                setBtnLoader(false);
                if (res && res.status === true) {
                    Toast.show(res.message);
                    NavigationService.navigate('EmailVerify', { regData: res?.data });
                    return true;
                } else {
                    Toast.show(res.message);
                    return false;
                }
            })
            .catch((err) => {
                console.log('Signup error', err);
                setBtnLoader(false);
                return false;
            });
    };

    const registerUser = () => {
        const userId = uuid.v4();
        firestore()
            .collection('Users')
            .doc(userId)
            .set({
                name,
                email,
                phone,
                password,
                userId,
            })
            .then(() => {
                console.log('User profile created successfully in Firebase');
            })
            .catch((err) => {
                console.log('User profile was not created in Firebase:', err);
            });
    };

    const handleSignup = async () => {
        const isSignupValid = await getsignup();
        if (isSignupValid) {
            registerUser();
        }
    };


    return (
        <View style={styles.container}>
            <Header title='SignUp' />
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <Image source={require('../../assets/images/rickshaw.png')} style={styles.logoimg_sty} />
                <Card style={{ ...styles.card_sty, backgroundColor: colors.cardColor }}>

                    <Text style={{ ...styles.input_title, color: colors.secondaryFontColor }}>Name</Text>
                    <TextInput
                        style={{
                            ...styles.inputcontainer_sty,
                            borderColor: colors.borderColor,
                            color: colors.secondaryFontColor
                        }}
                        placeholder=' Enter Your Name'
                        value={name}
                        onChangeText={(val) => setName(val)}
                        placeholderTextColor={colors.secondaryFontColor}
                    />

                    <Text style={{ ...styles.input_title, marginTop: moderateScale(10), color: colors.secondaryFontColor }}>Email Address</Text>
                    <TextInput
                        style={{
                            ...styles.inputcontainer_sty,
                            borderColor: colors.borderColor,
                            color: colors.secondaryFontColor
                        }}
                        value={email}
                        onChangeText={(val) => setEmail(val)}
                        placeholderTextColor={colors.secondaryFontColor}
                        placeholder='Enter Email Id'
                        keyboardType='email-address'
                    />

                    <Text style={{ ...styles.input_title, marginTop: moderateScale(10), color: colors.secondaryFontColor }}>Phone Number</Text>
                    <TextInput
                        style={{
                            ...styles.inputcontainer_sty,
                            borderColor: colors.borderColor,
                            color: colors.secondaryFontColor
                        }}
                        value={phone}
                        onChangeText={(val) => setPhone(val)}
                        placeholderTextColor={colors.secondaryFontColor}
                        placeholder='Enter Phone Number'
                        maxLength={10}
                        keyboardType='number-pad'
                    />

                    <Text style={{ ...styles.input_title, marginTop: moderateScale(10), color: colors.secondaryFontColor }}>New Password</Text>
                    <View style={{
                        ...styles.Password_Input_view, backgroundColor: colors.inputColor,
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

                    <Text style={{ ...styles.input_title, marginTop: moderateScale(10), color: colors.secondaryFontColor }}>Confirm New Password</Text>
                    <View style={{
                        ...styles.Password_Input_view, backgroundColor: colors.inputColor,
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
                    <View style={styles.check_view}>
                        <CheckBox
                            checked={check}
                            onChange={(val) => setCheck(val)}
                            size={18}
                            tintColor={colors.second_txt}
                            activeColor={'#fff'}
                            containerStyle={{ borderWidth: 1, borderColor: '#999' }}
                        />
                        <Text style={{ ...styles.rerember_txt, color: colors.secondaryFontColor }}>I Accept the Terms  & Conditions</Text>
                    </View>

                    <AppButton
                        textStyle={styles.buttn_txt}
                        style={styles.button_sty}
                        title="SignIn"
                        gradientStart={{ x: 0.3, y: 1 }}
                        gradientEnd={{ x: 1, y: 1 }}
                        gradient={true}
                        gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
                        onPress={() => handleSignup()}
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

                    <TouchableOpacity onPress={() => NavigationService.navigate('Login')}>
                        <Text style={{ ...styles.bottom_txt, color: colors.secondaryFontColor }}>Don’t have an account?
                            <Text style={styles.signup_txt}> Sign In</Text></Text>
                    </TouchableOpacity>
                </Card>
            </KeyboardAwareScrollView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoimg_sty: {
        height: moderateScale(190),
        width: moderateScale(220),
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    card_sty: {
        marginHorizontal: moderateScale(20),
        marginTop: moderateScale(-29.7),
        paddingTop: moderateScale(25),
        paddingBottom: moderateScale(30),
        marginBottom: moderateScale(20)
    },
    input_title: {
        fontSize: moderateScale(12),
        fontFamily: FONTS.Inter.semibold,
    },
    // password_sty: {
    //     height: moderateScale(45),
    //     width: moderateScale(250),
    //     borderWidth: 0,
    //     alignSelf: 'center',
    //     marginTop: moderateScale(-1),
    //     fontFamily: FONTS.Inter.medium,
    //     fontSize: moderateScale(12)
    // },
    passwordinput_view: {
        height: moderateScale(45),
        borderRadius: moderateScale(7),
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: moderateScale(10),
        marginTop: moderateScale(5)
    },
    inputcontainer_sty: {
        borderWidth: 1,
        height: moderateScale(45),
        borderRadius: moderateScale(5),
        borderWidth: 1,
        paddingLeft: moderateScale(7),
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12),
        height: moderateScale(45),
        width: moderateScale(290),
        marginTop: moderateScale(5)
    },
    text_input: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12)
    },

    check_view: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: moderateScale(10)
    },
    rerember_txt: {
        fontSize: moderateScale(12),
        fontFamily: FONTS.Inter.semibold,
        marginLeft: moderateScale(10)
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
    bottom_txt: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(13),
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(25),
        textAlign: 'center',
    },
    signup_txt: {
        fontFamily: FONTS.Inter.semibold,
        fontSize: moderateScale(13),
        color: 'rgba(2,142,0,255)'
    },
    passwordInputcontainer_sty: {
        alignSelf: 'center',
        height: moderateScale(45),
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12),
        width: moderateScale(245),
        borderRadius: moderateScale(10),
    },
    Password_Input_view: {
        height: moderateScale(45),
        width: width - moderateScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        // marginHorizontal: moderateScale(15),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(7),
        marginTop: moderateScale(7),
        borderWidth: 1,
    },
});

//make this component available to the app
export default Signup;

