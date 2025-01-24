//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { AppButton, AppTextInput, Card, CheckBox, Icon, useTheme } from 'react-native-basic-elements';
import Header from '../../Components/Header/Header';
import { Image } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import NavigationService from '../../Services/Navigation';
import AuthService from '../../Services/Auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from "react-native-simple-toast";
import { setuser } from '../../Redux/reducer/User';
import { useDispatch } from 'react-redux';
import { onForegroundEvent, onNotification, onOpenNotification } from '../../Services/Notification/NotifeeService';
import notifee, { EventType } from '@notifee/react-native';
import { fcmService } from '../../Services/Notification/FCMservice';
import Modal from 'react-native-modal';
import RenderHtml from 'react-native-render-html';


const { height, width } = Dimensions.get('screen');
// create a component
const Login = ({ navigation }) => {
    const dispatch = useDispatch()
    const colors = useTheme()
    const [email, setEmail] = useState('')
    const [btnLoader, setBtnLoader] = useState(false);
    const [check, setCheck] = useState(false);
    const [password, setPassword] = useState('')
    const [dToken, setDToken] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [activeUser, setActiveUser] = useState('');
    const [isTermsModal, setTermsModal] = useState(false);
    const [isConditionModal, setConditionModal] = useState(false);
    const [Termssettings, setTermsSettings] = useState(null);
    const [Privacyettings, setPrivacyettings] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkUser();
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        notifee.requestPermission();
        notifee.onForegroundEvent(onForegroundEvent);
        notifee.onBackgroundEvent(async ({ type, detail }) => {
            const { notification } = detail;
            if (type == EventType.PRESS) {
                await notifee.cancelNotification(notification.id);
            }
        });

        return () => {
            // Clean up FCM service or other listeners if needed
        };
    }, []);

    const checkUser = async () => {
        try {
            const result = await AuthService.getAccount();
            setActiveUser(result);
            //   console.log('lololololo----------------------=====', result);
            if (result) {
                dispatch(setuser(result));
            }
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    function onRegister(Dvtoken) {
        // console.log("Notification token=======================================", Dvtoken);
        setDToken(Dvtoken)
    }

    useEffect(() => {
        FetchTermSetting();
        FetchPrivacySetting()
    }, []);

    const FetchTermSetting = () => {
        setLoading(true);
        AuthService.getTermsData()
            .then(res => {
                // console.log('Settings fetched:===============', res);

                if (res && res.data && res.data.description) {
                    setTermsSettings({
                        html: res?.data?.description,
                    });
                } else {
                    console.log('Invalid response structure:', res);
                }
            })
            .catch(err => {
                console.log('Settings fetch error:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    const FetchPrivacySetting = () => {
        setLoading(true);
        AuthService.getPolicyData()
            .then(res => {

                if (res && res.data && res.data.description) {
                    setPrivacyettings({
                        html: res?.data?.description,
                    });
                } else {
                    console.log('Invalid response structure:', res);
                }
            })
            .catch(err => {
                console.log('Settings fetch error:', err);
            })
            .finally(() => {
                setLoading(false)
            });
    };


    const loginUser = () => {
        let hasError = false;

        if (email.trim() === '') {
            Toast.show('Please enter Your Mobile Number');
            return;
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
        if (!check) {
            Toast.show('Please accept our terms and conditions before login');
            hasError = true;
        }
        if (hasError) return false;
        setBtnLoader(true);
        const data = {
            "phone": email,
            "password": password,
            "device_token": dToken
        };
        // console.log('Login data:================', data);

        AuthService.getlogin(data)

            .then((res) => {
                // console.log('Verification response:===============================', res);
                if (res && res.status == true) {
                    AuthService.setToken(res?.token)
                    if (res?.data?.is_profile_update === 0) {
                        setBtnLoader(false)
                        NavigationService.navigate('Presonal_Info', { signupData: res })
                    } else {
                        setBtnLoader(false)
                        AuthService.setAccount(res.data);
                        AuthService.setToken(res?.token);
                        dispatch(setuser(res.data));
                    }
                } else {
                    setBtnLoader(false)
                    Toast.show(res.message)
                }
            })
            .catch((err) => {
                // console.error('Verification error:===============================', err);
                setBtnLoader(false)
            });

    };

    return (
        <View style={styles.container}>
            <Header title='SignIn' />
            <KeyboardAwareScrollView>
                <Image source={require('../../assets/images/rickshaw.png')} style={styles.logoimg_sty} />
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
                    <Text style={{ ...styles.input_title, color: colors.light_txt }}>Password</Text>
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

                    <Text
                        onPress={() => NavigationService.navigate('ForgotEmail')}
                        style={{ ...styles.forgotpassward_txt, color: colors.secondaryFontColor }}>Forgot Password?</Text>

                    <View style={styles.check_view}>
                        <CheckBox
                            checked={check}
                            onChange={(val) => setCheck(val)}
                            size={16}
                            tintColor={colors.second_txt}
                            activeColor={'#fff'}
                            containerStyle={{ borderWidth: 1, borderColor: '#999' }}
                        />
                        <Text style={{ ...styles.rerember_txt, color: colors.secondaryFontColor }}>
                            I Accept the
                            <Text
                                onPress={() => setTermsModal(true)}
                                style={{ color: 'rgba(2,142,0,255)', textDecorationLine: 'underline' }}> Terms & Conditions </Text>
                            and <Text
                                onPress={() => setConditionModal(true)}
                                style={{ color: 'rgba(2,142,0,255)', textDecorationLine: 'underline' }} >Privacy policy</Text></Text>
                    </View>

                    <AppButton
                        textStyle={styles.buttn_txt}
                        style={styles.button_sty}
                        title="SignIn"
                        gradientStart={{ x: 0.3, y: 1 }}
                        gradientEnd={{ x: 1, y: 1 }}
                        gradient={true}
                        gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
                        onPress={() => loginUser()}
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

                    <TouchableOpacity onPress={() => NavigationService.navigate('Signup')}>
                        <Text style={{ ...styles.bottom_txt, color: colors.secondaryFontColor }}>Don’t have an account?
                            <Text style={styles.signup_txt}> Sign Up</Text></Text>
                    </TouchableOpacity>
                </Card>
            </KeyboardAwareScrollView>


            <Modal
                isVisible={isTermsModal}
                backdropOpacity={0.8}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.modalView}>
                    <Icon type='AntDesign' name='close' size={22} color={colors.buttonColor} style={{ alignSelf: 'flex-end' }}
                        onPress={() => setTermsModal(false)} />
                    <ScrollView>
                        <RenderHtml
                            contentWidth={300}
                            source={Termssettings || { html: '' }}

                            baseStyle={{
                                fontFamily: FONTS.Poppins.medium,
                                color: '#000',
                                fontSize: moderateScale(14),
                                // textAlign: 'center',
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setTermsModal(false)}
                            style={{ ...styles.modal_botton, backgroundColor: colors.buttonColor }}>
                            <Text style={{
                                fontFamily: FONTS.Poppins.medium,
                                color: '#fff',
                                fontSize: moderateScale(12),
                                textAlign: 'center',
                            }}>Accept</Text>
                        </TouchableOpacity>
                    </ScrollView>

                </View>
            </Modal>


            <Modal
                isVisible={isConditionModal}
                backdropOpacity={0.8}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.modalView}>
                    <Icon type='AntDesign' name='close' size={22} color={colors.buttonColor} style={{ alignSelf: 'flex-end' }}
                        onPress={() => setConditionModal(false)} />
                    <ScrollView>
                        <RenderHtml
                            contentWidth={300}
                            source={Privacyettings || { html: '' }}
                            baseStyle={{
                                fontFamily: FONTS.Poppins.medium,
                                color: '#000',
                                fontSize: moderateScale(14),
                                // textAlign: 'center',
                            }}
                        />

                        <TouchableOpacity
                            onPress={() => setConditionModal(false)}
                            style={{ ...styles.modal_botton, backgroundColor: colors.buttonColor }}>
                            <Text style={{
                                fontFamily: FONTS.Poppins.medium,
                                color: '#fff',
                                fontSize: moderateScale(12),
                                textAlign: 'center',
                            }}>Accept</Text>
                        </TouchableOpacity>
                    </ScrollView>

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
        marginBottom: moderateScale(2)
    },
    input_title: {
        fontSize: moderateScale(12),
        fontFamily: FONTS.Inter.semibold,
    },
    forgotpassward_txt: {
        fontSize: moderateScale(12),
        fontFamily: FONTS.Inter.semibold,
        textAlign: 'right',
        marginTop: moderateScale(5)
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
    inputcontainer_sty: {
        height: moderateScale(45),
        width: moderateScale(250),
        borderWidth: 0,
        alignSelf: 'center',
        marginTop: moderateScale(-1),
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12)
    },
    text_input: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12)
    },
    phonecode: {
        fontFamily: FONTS.Inter.medium,
        fontSize: moderateScale(12)
    },
    bottom_view: {
        flexDirection: 'row',
        marginTop: moderateScale(10),
        justifyContent: 'flex-start',
    },
    check_view: {
        flexDirection: 'row',
        marginTop:moderateScale(7)
    },
    rerember_txt: {
        fontSize: moderateScale(12),
        fontFamily: FONTS.Inter.medium,
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
        marginTop: moderateScale(25)
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
    PasswordInput_view: {
        height: moderateScale(45),
        width: width - moderateScale(60),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(7),
        marginTop: moderateScale(7),
        borderWidth: 1,
    },
    modalView: {
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        padding: moderateScale(10)
    },
    modal_botton: {
        height: moderateScale(40),
        width: moderateScale(90),
        borderRadius: moderateScale(5),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }
});

//make this component available to the app
export default Login;
