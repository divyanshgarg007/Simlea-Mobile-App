/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import hamburgerIcon from '../assets/images/hamburger.png';
import hamburgerIconLight from '../assets/images/hamburgerLight.png';
import normalize from 'react-native-normalize';
import { useSelector } from 'react-redux';

export default function Hamburger(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  return (
    <TouchableOpacity onPress={() => props.onClick()}>
      <Image source={themeState?.activeTheme === 'light' ? hamburgerIconLight : hamburgerIcon}
        style={themeState?.activeTheme === 'light' ? styles.hamburgerSizeLight : styles.hamburgerSize} />
    </TouchableOpacity>
  );
}

export const styles = StyleSheet.create({
  hamburgerSize: {width: 26, height: 18, marginLeft: 0, resizeMode: 'contain'},
  hamburgerSizeLight: {width: 38, height: 38, marginLeft: 0, resizeMode: 'contain', marginTop: 0},
});
