import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
//import normalize from 'react-native-normalize';
//import GlobalStyle from '../../../style/globalstyle';
import CheckBox from 'react-native-check-box';
import { useSelector } from 'react-redux';
import GlobalStyle from '../../../style/globalstyle';

export default function CheckedElement(props) {
  const [checkedd, setCheckedd] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const formReducer = useSelector(state => state.rootReducers?.formReducer);
  console.log(props.elements[0]);
  return (
    <View style={styles.container}>
      <CheckBox
        style={{ flex: 1, padding: 14, alignItems: 'center' }}
        onClick={() => {
          let nn = !checkedd;
          setCheckedd(nn);
        }}
        isChecked={checkedd}
        rightText={props.elements[0].label[formReducer.activeFormLanguage]}
        checkBoxColor={'#FBFBFB'}
        checkedCheckBoxColor={'#FBFBFB'}
        uncheckedCheckBoxColor={'#FBFBFB'}
        disabled={false}
        rightTextStyle={
          themeState?.activeTheme === 'light'
            ? styles.textColorLight
            : styles.textColor
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '90%',
    marginLeft: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#30C6EA',
    backgroundColor: '#30C6EA',
    marginBottom: 10,
  },
  checkbox: {
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#FBFBFB',
    // borderRadius: 20,
  },
  textColor: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#fff',
  },
  textColorLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 18 : 14,
    color: '#1a1a1a',
  },
});
