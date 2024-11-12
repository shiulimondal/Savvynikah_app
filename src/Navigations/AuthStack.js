//import liraries
import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Splash from '../Screens/Auth/Splash';
import Otp from '../Screens/Auth/Otp';
import Signup from '../Screens/Auth/Signup';
import Login from '../Screens/Auth/Login';
import EmailVerify from '../Screens/Auth/EmailVerify';
import ForgotEmail from '../Screens/Auth/ForgotPassword/ForgotEmail';
import ForgotOTP from '../Screens/Auth/ForgotPassword/ForgotOTP';
import SetPassword from '../Screens/Auth/ForgotPassword/SetPassword';
import Presonal_Info from '../Screens/Auth/RegProfile/Presonal_Info';
import Professional_Info from '../Screens/Auth/RegProfile/Professional_Info';
import Other_Info from '../Screens/Auth/RegProfile/Other_Info';

const Stack = createStackNavigator();
// create a component
const AuthStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Splash'
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Signup" component={Signup} />

            <Stack.Screen name="EmailVerify" component={EmailVerify} />
            <Stack.Screen name="ForgotEmail" component={ForgotEmail} />
            <Stack.Screen name="ForgotOTP" component={ForgotOTP} />
            <Stack.Screen name="SetPassword" component={SetPassword} />
            <Stack.Screen name="Presonal_Info" component={Presonal_Info} />
            <Stack.Screen name="Professional_Info" component={Professional_Info} />
            <Stack.Screen name="Other_Info" component={Other_Info} />

        </Stack.Navigator>
    );
};

export default AuthStack;
