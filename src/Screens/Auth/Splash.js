// import libraries
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated } from 'react-native';
import { StatusBar } from 'react-native-basic-elements';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale } from '../../Constants/PixelRatio';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from '../../Services/Auth';
import NavigationService from '../../Services/Navigation';

const { height, width } = Dimensions.get('screen');

// create a component
const Splash = ({ navigation }) => {
    const { login_status, userData } = useSelector(state => state.User);
    const dispatch = useDispatch();
    const [activeUser, setActiveUser] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }
            ),
            Animated.timing(
                scaleAnim,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }
            )
        ]).start();
    }, [fadeAnim, scaleAnim]);

    useEffect(() => {
        checkUser();
    }, []);

    useEffect(() => {
        if (login_status !== undefined) {
            setTimeout(() => {
                if (userData && login_status) {
                    NavigationService.navigate('UserStack');
                } else {
                    NavigationService.navigate('Login');
                }
            }, 3000);
        }
    }, [login_status, userData]);

    const checkUser = async () => {
        try {
            const result = await AuthService.getAccount();
            setActiveUser(result);

            if (result) {
                dispatch(setuser(result));

            }
        } catch (error) {
            console.error('Error checking user:', error);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={'transparent'}
                barStyle='dark-content'
                translucent={true}
            />
            <View
                // start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
                // colors={['rgb(244, 247, 247)', 'rgb(243, 248, 255)']}
                // locations={[0.1, 1]}
                style={styles.gradient_view}
            >

                <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>
                    <Image source={require('../../assets/images/logo.png')} style={styles.logo_sty} />
                </Animated.View>

            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient_view: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height,
        width: width,
        backgroundColor:'#fff'
    },
    logo_sty: {
        height: moderateScale(250),
        width: moderateScale(250),
        resizeMode: 'contain'
    }
});

// make this component available to the app
export default Splash;
