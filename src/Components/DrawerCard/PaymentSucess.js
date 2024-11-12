//import liraries
import React, { Component } from 'react';
import { Dimensions, Image } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { moderateScale } from '../../Constants/PixelRatio';
import { FONTS } from '../../Constants/Fonts';
import { useTheme } from 'react-native-basic-elements';

const { height, width } = Dimensions.get('screen');
// create a component
const  PaymentSucess= ({paymentData}) => {
    const colors = useTheme();
    console.log('paymenttttttttttttttttttttdata',paymentData);
    
    return (
        <View style={styles.container}>
           <Image
                    source={require('../../assets/images/order_confirmed.png')}
                    style={styles.getpremium_img}
                />
                <View style={{alignItems:'center',marginTop:moderateScale(15)}}>
                <Text style={{...styles.sucess_txt,color:colors.secondaryFontColor}}>Payment Succcessfull</Text>
                <Text style={{...styles.transaction_txt,color:colors.secondaryFontColor}}>Transaction Number : {paymentData?.transaction_id}</Text>
                <View style={styles.line} />
                <Text style={{...styles.amount_txt,color:colors.secondaryFontColor}}>Amount Paid : <Text style={{color:colors.text_color}}>₹{paymentData.price}</Text></Text>
                <Text style={{...styles.amount_txt,marginTop:moderateScale(5),color:colors.secondaryFontColor}}>Payed By <Text style={{color:colors.text_color}}>phonepe</Text></Text>
                </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    getpremium_img: {
        height: moderateScale(200),
        width: width,
        resizeMode: 'contain',
        marginTop: moderateScale(10),
        marginTop:moderateScale(15)
    },
    sucess_txt:{
        fontFamily:FONTS.Inter.semibold,
        fontSize:moderateScale(17)
    },
    transaction_txt:{
        fontFamily:FONTS.Inter.medium,
        fontSize:moderateScale(12),
        marginTop:moderateScale(7)
    },
    amount_txt:{
        fontFamily:FONTS.Inter.regular,
        fontSize:moderateScale(12),
    },
    line: {
        borderWidth: .3,
        borderColor: '#9F9F9F',
        marginTop: moderateScale(3),
        width:width-moderateScale(150),
        textAlign:'center',
        marginTop:moderateScale(5),
        marginBottom:moderateScale(5)
    },
});

//make this component available to the app
export default PaymentSucess;
