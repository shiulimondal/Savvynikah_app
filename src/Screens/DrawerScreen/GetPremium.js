import React, { useEffect, useState } from 'react';
import { Image, ScrollView, View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { AppButton, useTheme } from 'react-native-basic-elements';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import SubscriptionCard from '../../Components/DrawerCard/SubscriptionCard';
import { useNavigation } from '@react-navigation/native';
import HomeService from '../../Services/HomeServises';
import uuid from 'react-native-uuid';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import NavigationService from '../../Services/Navigation';
import Modal from "react-native-modal";
import PaymentSucess from '../../Components/DrawerCard/PaymentSucess';
import PhonePePaymentSDK from 'react-native-phonepe-pg'
import sha256 from 'sha256'
import Base64 from 'react-native-base64'

const { height, width } = Dimensions.get('screen');

const GetPremium = () => {
    const { userData } = useSelector(state => state.User)
    console.log('hgggggggggggggggggggg', userData);
    const colors = useTheme();
    const navigation = useNavigation();
    const [selectedPlan, setSelectedPlan] = useState(null);
    console.log('hgggggggggggggggggggg', selectedPlan);
    const [subPlanList, setSubPlanList] = useState([])
    const [paymentData, setPaymentData] = useState({})
    const [price, setprice] = useState('');

    const [loading, setLoading] = useState(true);
    const [btnLoader, setBtnLoader] = useState(false);
    const [isModalShow, setModalShow] = useState(false);
    const toggleModal = () => {
        setModalShow(!isModalShow);
    };

    const handlePlanSelect = (index) => {
        console.log('gggggggggggggggggggpriceeeeeeeeeeeeeee', index);

        setSelectedPlan(index);
        setprice(index.price)
    };

    useEffect(() => {
        getSubscriptionData()
    }, [])

    const getSubscriptionData = () => {
        HomeService.getSubscriptionList()
            .then((res) => {
                console.log('ddddddsssssssssssssssssss00000000000', res);
                if (res && res.status == true) {
                    setSubPlanList(res.data)
                }
            })
            .catch((err) => {
                console.log('homeerrr', err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [environment, setEnviroment] = useState("SANDBOX")
    const [merchantId, setMerchantId] = useState('PGTESTPAYUAT105')
    const [appId, setAppId] = useState(null)
    const [enableLogging, setEnableLogging] = useState(true)

    const generateTransactionId = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000000);
        const merchantPrefix = "T";
        return `${merchantPrefix}${timestamp}${random}`
    }

    // UAT Credentials
    // MID: PGTESTPAYUAT105
    // Test card details:
    // Netbanking Credentials
    // "card_number": "4208 5851 9011 6667", Username: test
    // Salt Index: 1
    // Salt Key: c45b52fe-f2c5-4ef6-a6b5-131aa89ed133 "card_type": "CREDIT_CARD",
    // "card_issuer": "VISA",
    // "expiry_month": 06,
    // "expiry_year": 2027,
    // "cvv": "508"
    // Bank Page OTP: 123456
    // Password: test


    const SubmitHandler = () => {
        PhonePePaymentSDK.init(environment, merchantId, appId, enableLogging)
            .then((res) => {
                const requestBody = {
                    merchantId: merchantId,
                    merchantTransactionId: generateTransactionId(),
                    merchantUserId: "",
                    amount: (price * 100),
                    mobileNumber: userData?.phone,
                    callbackUrl: "",
                    paymentInstrument: {
                        type: "PAY_PAGE"
                    }
                };

                const salt_key = "c45b52fe-f2c5-4ef6-a6b5-131aa89ed133";
                const salt_Index = 1;
                const payload = JSON.stringify(requestBody);
                const payload_main = Base64.encode(payload);
                const string = payload_main + "/pg/v1/pay" + salt_key;
                const checksum = sha256(string) + "###" + salt_Index;

                PhonePePaymentSDK.startTransaction(payload_main, checksum, null, null)
                    .then((paymentRes) => {
                        console.log('Payment Response:===================================', paymentRes);
                        // Only call submitPayment if payment is successful
                        // {"status": "SUCCESS"}
                        if (paymentRes.status === "SUCCESS") {
                            // Generate unique UUID
                            const uniquePaymentId = uuid.v4();
                            console.log('Generated UUID================================:', uniquePaymentId);
                            // Pass the UUID to submitPayment
                            submitPayment(uniquePaymentId);
                        } else {
                            // Handle failure case
                            console.log('Payment failed or status is not SUCCESS', paymentRes.status);
                            Toast.show('Server Error. Please try again Later.', Toast.BOTTOM);
                        }
                    })
                    .catch((err) => {
                        console.log('Payment error', err);
                        Toast.show('An error occurred during payment. Please try again.', Toast.BOTTOM);
                    });
            })
            .catch((err) => {
                console.log('PhonePe SDK init error', err);
            });
    };

    const submitPayment = ((uniquePaymentId) => {
        let data = {
            "subscription_id": selectedPlan?.id,
            "transaction_id": generateTransactionId(),
            "order_id": uniquePaymentId
        }
        // setBtnLoader(true)
        console.log('submittttttttttttttttttttttttttt=======================', data);

        HomeService.getSubmitPayment(data)
            .then((res) => {
                console.log('paymentttttttttttttttttttttttttttttttttttt====================', res);
                if (res && res.status == true) {
                    setBtnLoader(false)
                    setModalShow(true);
                    setPaymentData(res.data)
                    setTimeout(() => {
                        setModalShow(false);
                        NavigationService.navigate('Home')
                    }, 3000);
                    setBtnLoader(false);
                } else if(res && res.status == false) {
                    setBtnLoader(false)
                    Toast.show(res.message);
                    setTimeout(() => {
                        NavigationService.navigate('Home')
                    }, 3000);
                }
                else{
                    setBtnLoader(false)
                    Toast.show(res.message); 
                }
            })
            .catch((err) => {
                console.log('paymenterr', err);
                setBtnLoader(false)
            })
    })




    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{ ...styles.title_txt, color: colors.secondaryFontColor }}>Get Premium</Text>
                <Text numberOfLines={2} style={{ ...styles.details_txt, color: colors.secondaryFontColor }}>
                    Unlock all the power of this mobile tool and enjoy digital experience like never before!
                </Text>
                <Image
                    source={require('../../assets/images/getpremium.png')}
                    style={styles.getpremium_img}
                />
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="rgba(2,142,0,255)" />
                    </View>
                ) : (
                    <View>
                        {subPlanList.map((item, index) => (
                            <SubscriptionCard
                                item={item}
                                index={index}
                                key={index}
                                onSelect={handlePlanSelect}
                                selectedPlan={selectedPlan}
                            />
                        ))}
                    </View>
                )}
                <AppButton
                    textStyle={styles.buttn_txt}
                    style={styles.button_sty}
                    title="Pay Now"
                    gradientStart={{ x: 0.3, y: 1 }}
                    gradientEnd={{ x: 1, y: 1 }}
                    gradient={true}
                    gradientColors={['rgba(30,68,28,255)', 'rgba(2,142,0,255)']}
                    onPress={() => SubmitHandler()}
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
                <Text style={{ ...styles.bottom_txt, color: colors.secondaryFontColor }}>
                    By Placing this order, you agree to the Terms of Service and Privacy Policy. Subscription Automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                </Text>
            </ScrollView>
            <Modal
                isVisible={isModalShow}
                style={{
                    margin: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <View style={styles.modalView}>
                    <PaymentSucess paymentData={paymentData} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    title_txt: {
        fontFamily: FONTS.Inter.bold,
        fontSize: moderateScale(25),
        textAlign: 'center',
        marginTop: moderateScale(15)
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    details_txt: {
        textAlign: 'center',
        marginHorizontal: moderateScale(20),
        marginTop: moderateScale(10),
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(12)
    },
    getpremium_img: {
        height: moderateScale(220),
        width: width,
        resizeMode: 'contain',
        marginTop: moderateScale(10)
    },
    buttn_txt: {
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(14)
    },
    button_sty: {
        height: moderateScale(40),
        width: moderateScale(150),
        borderRadius: moderateScale(5),
        alignSelf: 'center',
        marginTop: moderateScale(40)
    },
    bottom_txt: {
        textAlign: 'center',
        marginHorizontal: moderateScale(15),
        marginTop: moderateScale(15),
        fontFamily: FONTS.Inter.regular,
        fontSize: moderateScale(11),
        marginBottom: moderateScale(15)
    },
    modalView: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default GetPremium;
