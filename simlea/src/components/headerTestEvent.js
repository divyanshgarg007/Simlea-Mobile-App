import React from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import Demo from '../assets/images/demo-inc.png';
import {useSelector} from 'react-redux';
import normalize from 'react-native-normalize';
import GlobalStyle from '../style/globalstyle';

export default function HeaderTestEvent(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  return (
    <View
      style={[
        styles.header,
        themeState.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : {backgroundColor: '#1A1A1A'},
      ]}>
      <View
        style={[
          styles.demoIconBox,
          themeState.activeTheme === 'light'
            ? {backgroundColor: '#30C6EA'}
            : {backgroundColor: '#2E2E2E'},
        ]}>
        <Image source={Demo} style={styles.demoIcon} />
        <Text style={styles.demoIconText}>Demo Inc.</Text>
      </View>
      <View
        style={[
          styles.headTextBox,
          themeState.activeTheme === 'light'
            ? {backgroundColor: '#30C6EA'}
            : {backgroundColor: '#2E2E2E'},
        ]}>
        <Text style={styles.headText}>{props?.event}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1A1A1A',
  },
  demoIconBox: {
    marginTop: 15,
    borderRadius: 5,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#2E2E2E',
    width: '26%',
    paddingVertical: 18,
    marginBottom: 11,
  },
  demoIcon: {
    height: Platform.isPad === true ? 43 : 36,
    width: Platform.isPad === true ? 43 : 36,
    alignSelf: 'center',
  },
  demoIconText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 13,
    color: '#DBECFE',
    alignSelf: 'center',
  },
  headTextBox: {
    backgroundColor: '#2E2E2E',
    marginTop: 11,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '75%',
    paddingVertical: 8,
    marginBottom: 21,
    borderRadius: 5,
  },
  headText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginRight: 4,
    lineHeight: 20,
  },
});
