/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

export default function HeaderButton(props) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Image source={props.source} style={styles.headerIcon} />
    </TouchableOpacity>
  );
}
export const styles = StyleSheet.create({
  headerIcon: {
    width: 38,
    height: 38,
  },
});
