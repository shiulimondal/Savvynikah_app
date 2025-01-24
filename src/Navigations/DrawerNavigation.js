import { StyleSheet } from 'react-native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerCard from '../Components/DrawerCard/DrawerCard';
import Home from '../Screens/Home/Home';
import HomeHeader from '../Components/Header/HomeHeader';
import MyProfile from '../Screens/DrawerScreen/MyProfile';
import MyVisitor from '../Screens/DrawerScreen/MyVisitor';
import Setting from '../Screens/DrawerScreen/Setting';
import MySubscription from '../Screens/DrawerScreen/MySubscription';
import MyChat from '../Screens/DrawerScreen/MyChat';
import MyWishlist from '../Screens/DrawerScreen/MyWishlist';
import SingleChatScreen from '../Screens/DrawerScreen/SingleChatScreen';
import ViewProfile from '../Screens/DrawerScreen/ViewProfile/ViewProfile';
import GetPremium from '../Screens/DrawerScreen/GetPremium';
import Support from '../Screens/DrawerScreen/Support';


const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
    return (
        <Drawer.Navigator
            initialRouteName='Home'
            drawerContent={props => <DrawerCard {...props} />}
            screenOptions={({ route }) => ({
                headerShown: true,
                header: (props) => <HomeHeader {...props} route={route} />,
                drawerStyle: {
                    backgroundColor: '#1D3557',
                },
            })}
        >
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="MyProfile" component={MyProfile} />
            <Drawer.Screen name="MyVisitor" component={MyVisitor} />
            <Drawer.Screen name="Setting" component={Setting} />
            <Drawer.Screen name="MySubscription" component={MySubscription} />
            <Drawer.Screen name="MyChat" component={MyChat} />
            <Drawer.Screen name="MyWishlist" component={MyWishlist} />
            <Drawer.Screen name="SingleChatScreen" component={SingleChatScreen} />
            <Drawer.Screen name="ViewProfile" component={ViewProfile} />
            <Drawer.Screen name="Support" component={Support} />

            {/* for extra---------------------- */}
            <Drawer.Screen name="GetPremium" component={GetPremium} />
            {/* --------------------- */}
     
        </Drawer.Navigator>
    );
};

export default DrawerNavigation;
