/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '../constants';
import {EventNavigator} from './EventNavigator';
import {Hamburger, HeaderTitle, HeaderButton, HeaderLogo} from '../components';
import Logo from '../assets/images/logo-black.png';
import Logolight from '../assets/images/logo-white.png';
import {LoginView} from '../screens';
import {Image, View} from 'react-native';
import ForgotPassword from '../screens/Login/components/forgotPassword';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();
export function AuthNavigator(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  return (
    <Stack.Navigator
      screenOptions={({route, navigation}) => ({
        headerStyle: {
          backgroundColor:
            themeState?.activeTheme === 'light' ? '#FBFBFB' : '#1A1A1A',
          borderBottomWidth: 1,
          // height: 70,
        },
        headerTitleAlign: 'center',
        headerBackVisible: false,
      })}>
      <Stack.Screen
        name={NAVIGATION.login}
        component={LoginView}
        options={({navigation}) => ({
          headerLeft: props => {
            return themeState?.activeTheme === 'light' ? (
              <HeaderLogo source={Logo} />
            ) : (
              <HeaderLogo source={Logolight} />
            );
          },
          headerTitle: props => {
            return <HeaderTitle title="Login" />;
          },
          headerRight: props => {
            return <Hamburger onClick={() => navigation.openDrawer()} />;
          },
        })}
      />
      <Stack.Screen
        name={NAVIGATION.forgotPassword}
        component={ForgotPassword}
        options={({navigation}) => ({
          headerLeft: props => {
            return themeState?.activeTheme === 'light' ? (
              <HeaderLogo source={Logo} />
            ) : (
              <HeaderLogo source={Logolight} />
            );
          },
          headerRight: props => {
            return <Hamburger onClick={() => navigation.openDrawer()} />;
          },
          headerTitle: props => {
            return <HeaderTitle title="Forget Password" />;
          },
        })}
      />
      <Stack.Screen
        name="EventNavigator"
        component={EventNavigator}
        options={({navigation}) => ({
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}