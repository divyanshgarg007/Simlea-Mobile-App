/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {useColorScheme, AppearanceProvider, Text} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';

export default function RootNavigator(props) {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
