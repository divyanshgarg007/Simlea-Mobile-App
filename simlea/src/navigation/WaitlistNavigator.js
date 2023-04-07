/* eslint-disable prettier/prettier */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NAVIGATION } from '../constants';
import Home from '../assets/images/home.png';
import { SettingView, WaitListView } from '../screens';
import { styles } from './navigator.style';
import { GoBack, HeaderTitle ,HeaderButton} from '../components';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
export function WaitlistNavigator(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  return (
    <Stack.Navigator
      screenOptions={({ route, navigation }) => ({
        headerStyle: {
          backgroundColor: themeState?.activeTheme === 'light' ? '#FBFBFB' : '#1A1A1A',
        borderBottomWidth: 1,
        // height: 70,
        },
        headerTitleAlign: 'center',
        headerBackVisible: false,
      })}>

      <Stack.Screen
        name={NAVIGATION.waitlist}
        component={WaitListView}
        options={({ navigation }) => ({
          headerLeft: props => {
            return (
              <GoBack onPress={()=> navigation.goBack()} />
            );
          },
          headerTitle: props => {
            return <HeaderTitle title="Wait List" />;
          },
          headerRight: () => {
        return <HeaderButton onPress={()=> navigation.navigate(NAVIGATION.dashboard)} source={Home} />;
          },
        })}
      />
    </Stack.Navigator>
  );
}
