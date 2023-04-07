/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '../constants';
import {SettingView} from '../screens';
import {styles} from './navigator.style';
import {GoBack, HeaderTitle} from '../components';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
export function SettingNavigator(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  return (
    <Stack.Navigator
      screenOptions={({route, navigation}) => ({
        headerStyle: {
          backgroundColor: themeState?.activeTheme === 'light' ? '#FBFBFB' : '#1A1A1A',
          borderBottomWidth: 1,
          // height: 70,
        },
        headerTitleAlign: 'center',
        headerBackVisible: false,
      })}>
      <Stack.Screen
        name={NAVIGATION.settings}
        component={SettingView}
        options={({navigation}) => ({
          headerLeft: props => {
            return <GoBack onPress={() => navigation.goBack()} />;
          },
          headerTitle: props => {
            return <HeaderTitle title="Settings" />;
          },
        })}
      />
    </Stack.Navigator>
  );
}
