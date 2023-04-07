// eslint-disable prettier/prettier /
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '../constants';
import {Hamburger, HeaderTitle, HomeButton} from '../components';
import AppNavigator from './AppNavigator';
import {EventListView} from '../screens';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();
export function EventNavigator(props) {
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
        name={NAVIGATION.eventList}
        component={EventListView}
        options={({navigation}) => ({
          headerRight: props => {
            return <Hamburger onClick={() => navigation.openDrawer()} />;
          },
          headerTitle: props => {
            return <HeaderTitle title="Events" />;
          },
        })}
      />
      <Stack.Screen
        name="AppNavigator"
        component={AppNavigator}
        options={({navigation}) => ({
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}
