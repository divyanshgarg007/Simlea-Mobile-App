/* eslint-disable prettier/prettier */
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import GlobalStyle from '../style/globalstyle';

export default function DropdownPicker(props) {
  return (
    <View>
      <DropDownPicker
        open={props.open}
        value={props.value}
        items={props.items}
        dropDownDirection={props.dropDownDirection}
        setOpen={props.setOpen}
        setValue={props.setValue}
        style={props.style}
        dropDownContainerStyle={styles.container}
        textStyle={styles.dropText}
        labelStyle={styles.labels}
        listMode="SCROLLVIEW"
        placeholderStyle={styles.placeholderStyles}
        placeholder={props.placeholder}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    elevation: 1000,
  },
  dropText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 16 : 12,
    color: '#000',
    textAlign: Platform.isPad === true ? 'center' : 'left',
  },
  labels: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 16 : 12,
    color: '#FBFBFB',
    textAlign: Platform.isPad === true ? 'center' : 'left',
  },
  placeholderStyles: {
    fontSize: Platform.isPad === true ? 16 : 12,
    color: '#FBFBFB',
  },
});
