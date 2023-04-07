import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import GlobalStyle from '../style/globalstyle';
import normalize from 'react-native-normalize';
import {useSelector} from 'react-redux';

export default function HeaderTitle(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  return (
    <View>
      <Text
        style={
          themeState?.activeTheme === 'light' ? styles.textLight : styles.text
        }>
        {props.title}
      </Text>
    </View>
  );
}
export const styles = StyleSheet.create({
  text: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay900,
    fontSize: Platform.isPad === true ? 24 : 18,
    color: '#FFFFFF',
  },
  textLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay900,
    fontSize: Platform.isPad === true ? 24 : 18,
    color: '#1a1a1a',
  },
});
