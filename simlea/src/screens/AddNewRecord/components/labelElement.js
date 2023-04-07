import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector} from 'react-redux';

export default function LabelElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  return (
    <View style={styles.mainView}>
      <Text
        style={
          themeState?.activeTheme === 'light'
            ? styles.textStyleLight
            : styles.textStyleDark
        }>
        {props.elements[0].label[formReducer.activeFormLanguage]}
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    // marginLeft: 10,
    marginTop: 10,
    marginHorizontal: 15,
  },
  textStyleLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#1a1a1a',
  },
  textStyleDark: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#fff',
  },
});
