import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigation from './DrawerNavigation';
import EditPresonalInfo from '../Screens/DrawerScreen/EditMyProfile/EditPresonalInfo';
import EditProfessionalInfo from '../Screens/DrawerScreen/EditMyProfile/EditProfessionalInfo';
import EditOtherInfo from '../Screens/DrawerScreen/EditMyProfile/EditOtherInfo';




const Stack = createStackNavigator();

// create a component
const UserStack = () => {
  return (
    <Stack.Navigator
            initialRouteName='DrawerNavigation'
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen name="EditPresonalInfo" component={EditPresonalInfo} />
            <Stack.Screen name="EditProfessionalInfo" component={EditProfessionalInfo} />
            <Stack.Screen name="EditOtherInfo" component={EditOtherInfo} />
         
        </Stack.Navigator>
  );
};

export default UserStack;

