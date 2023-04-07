/* eslint-disable prettier/prettier */
import React from 'react';
import {TouchableOpacity, Image, StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

export default function HeaderLogo(props) {
  return (
    <TouchableOpacity>
      <Image source={props.source} style={styles.headerLogo} />
    </TouchableOpacity>
  );
}
export const styles = StyleSheet.create({
  headerLogo: {
    width: 130,
    height: 40,
    resizeMode: 'contain',
  },
});
