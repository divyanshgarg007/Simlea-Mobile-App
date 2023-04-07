/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import {Selector, useSelector} from 'react-redux';
import normalize from 'react-native-normalize';
import GlobalStyle from '../style/globalstyle';

export default function HeaderTestMode() {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  return (
    <View>
      <View
        style={
          themeState?.activeTheme === 'light'
            ? styles.alertBoxLight
            : styles.alertBoxDark
        }>
        <Image
          source={require('../assets/images/alert.png')}
          style={styles.alertIcon}
        />
        <Text style={styles.alertText}>Test mode</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alertBoxDark: {
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  alertBoxLight: {
    flexDirection: 'row',
    backgroundColor: '#30C6EA',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 12,
  },
  alertIcon: {
    height: Platform.isPad === true ? 15 : 13,
    width: Platform.isPad === true ? 17 : 15,
    marginTop: Platform.isPad === true ? 6 : 0,
  },
  alertText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 20 : 10,
    color: '#F23636',
    marginLeft: 3,
  },
});
