import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '../constants';
import {
  Hamburger,
  HeaderTitle,
  HomeButton,
  GoBack,
  HeaderButton,
  SyncModal,
} from '../components';
import Home from '../assets/images/home.png';
import {DashboardView, FormEdit, ListsView} from '../screens';
import {DraftNavigator} from '../navigation/DraftNavigator';
import AddNewForm from '../screens/AddNewRecord/addNewForm';
import {useSelector} from 'react-redux';

const Stack = createNativeStackNavigator();
export function DashboardNavigator(props) {
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
        },
        headerTitleAlign: 'center',
        headerBackVisible: false,
      })}>
      <Stack.Screen
        name={NAVIGATION.dashboard}
        component={DashboardView}
        options={({navigation}) => ({
          headerRight: props => {
            return <Hamburger onClick={() => navigation.openDrawer()} />;
          },
          headerTitle: props => {
            return <HeaderTitle title="Dashboard" />;
          },
        })}
      />
      <Stack.Screen
        name={NAVIGATION.lists}
        component={ListsView}
        options={({navigation}) => ({
          tabBarVisible: false,
          headerLeft: props => {
            return (
              <HeaderButton
                onPress={() => navigation.navigate(NAVIGATION.dashboard)}
                source={Home}
              />
            );
          },
          headerRight: () => {
            return <Hamburger onClick={() => navigation.openDrawer()} />;
          },
        })}
      />
      <Stack.Screen
        name={NAVIGATION.draft}
        component={DraftNavigator}
        options={({navigation}) => ({
          headerShown: false,
          tabBarVisible: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      />

      <Stack.Screen name={NAVIGATION.addNewRecord} component={AddNewForm} />
      <Stack.Screen
        name={NAVIGATION.editForm}
        component={FormEdit}
        options={({navigation}) => ({
          tabBarVisible: false,
          headerLeft: props => {
            return <GoBack onPress={() => navigation.goBack()} />;
          },
          headerTitle: props => {
            return <HeaderTitle title="Form standard1" />;
          },
          headerRight: () => {
            return (
              <HeaderButton
                onPress={() => navigation.navigate(NAVIGATION.dashboard)}
                source={Home}
              />
            );
          },
        })}
      />
    </Stack.Navigator>
  );
}
