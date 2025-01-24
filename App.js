import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Theme } from 'react-native-basic-elements';
import NavigationService from './src/Services/Navigation';
import AuthStack from './src/Navigations/AuthStack';
import UserStack from './src/Navigations/UserStack';
import { useDispatch, useSelector } from 'react-redux';
import { setuser } from './src/Redux/reducer/User';
import AuthService from './src/Services/Auth';
import { firebase } from '@react-native-firebase/app';
import { firebaseConfig } from './src/Config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const Stack = createStackNavigator();

// create a component
const App = () => {
  const [isDark, setIsDark] = useState(false);
  const dispatch = useDispatch();
  const { login_status } = useSelector(state => state.User);
  console.log('login------------------------', login_status);
  const [activeUser, setActiveUser] = useState('');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const result = await AuthService.getAccount();
      setActiveUser(result);
      console.log('lololololo----------------------=====', result);
      if (result) {
        dispatch(setuser(result));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };



  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1
        }}
      >
        <Theme.Provider
          theme={{
            light: {
              primaryThemeColor: 'rgba(30,68,28,255)',
              secondaryThemeColor: '#fff',
              primaryFontColor: '#ffff',
              secondaryFontColor: '#272829',
              cardColor: '#F6F5F5',
              headerColor: 'rgba(42, 47, 65, 0.90)',
              pageBackgroundColor: '#FFFFFF',
              tabBarColor: '#fff',
              shadowColor: '#999',
              statusBarStyle: 'dark-content',
              buttonColor: 'rgba(30,68,28,255)',
              borderColor: '#999',
              card_txt_color: '#7F8DB4',
              dark_btn_color: '#222632',
              grey_textColor: '#e6e8e6',
              text_color: '#0EB34D',
              second_txt: 'rgba(2,142,0,255)',
              light_txt: '#4D4D4D',
              chatScreen: '#EEEEEE',
              senderView: 'rgba(2,142,0,0.2)',
              tabcolor: '#F2F2F2'
            },
            dark: {
              primaryThemeColor: 'rgba(30,68,28,255)',
              secondaryThemeColor: '#fff',
              primaryFontColor: '#fff',
              secondaryFontColor: '#272829',
              cardColor: '#F6F5F5',
              headerColor: 'rgba(42, 47, 65, 0.90)',
              pageBackgroundColor: '#FFFFFF',
              tabBarColor: '#fff',
              shadowColor: '#999',
              statusBarStyle: 'dark-content',
              buttonColor: 'rgba(30,68,28,255)',
              borderColor: '#999',
              card_txt_color: '#7F8DB4',
              dark_btn_color: '#222632',
              grey_textColor: '#e6e8e6',
              text_color: '#0EB34D',
              second_txt: 'rgba(2,142,0,255)',
              light_txt: '#4D4D4D',
              chatScreen: '#EEEEEE',
              senderView: 'rgba(2,142,0,0.2)',
              tabcolor: '#F2F2F2'
            },
          }}
          mode={isDark ? 'dark' : 'light'}
        >
          <NavigationContainer
            ref={r => NavigationService.setTopLevelNavigator(r)}
          >
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              {
                login_status === true ?
                  <Stack.Screen name="UserStack" component={UserStack} />
                  :
                  <Stack.Screen name="AuthStack" component={AuthStack} />
              }
            </Stack.Navigator>
          </NavigationContainer>
        </Theme.Provider>
      </View>
    </SafeAreaProvider>
  );
};

export default App;
