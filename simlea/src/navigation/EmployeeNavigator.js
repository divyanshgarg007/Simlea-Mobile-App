/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NAVIGATION} from '../constants';
import {GoBack, Hamburger, HeaderTitle, HeaderButton} from '../components';
import {
  EmployeeListView,
  CalendarView,
  EmployeeDetailsView,
  FormView,
} from '../screens';
import moment from 'moment';
import Home from '../assets/images/home.png';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
export function EmployeeNavigator(props) {
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
        name={NAVIGATION.employee}
        component={EmployeeListView}
        options={({navigation}) => ({
          headerRight: props => {
            return <Hamburger onClick={() => navigation.openDrawer()} />;
          },
          headerTitle: props => {
            return <HeaderTitle title="Employees" />;
          },
        })}
      />
      <Stack.Screen
        name={NAVIGATION.employeeDetails}
        component={EmployeeDetailsView}
        options={({navigation}) => ({
          headerLeft: props => {
            return <GoBack onPress={() => navigation.goBack()} />;
          },
          headerTitle: props => {
            var currentDate = moment().format('MM.DD.YYYY');
            return <HeaderTitle title={currentDate} />;
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
