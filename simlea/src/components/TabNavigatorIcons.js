/* eslint-disable prettier/prettier */
import React from 'react';
import {Image, View, StyleSheet, Platform} from 'react-native';

export default function TabNavigatorIcons(props) {
  return (
    <View style={[styles.imageBox, props.backgroundColor]}>
      <Image style={styles.iconImage} source={props.source} />
    </View>
  );
}
export const styles = StyleSheet.create({
  imageBox: {padding: Platform.isPad === true ? 20 : 10, borderRadius: 6},
  iconImage: {
    width: Platform.isPad === true ? 30 : 20,
    height: Platform.isPad === true ? 30 : 20,
  },
});
