import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import normalize from 'react-native-normalize';

export default function GoBack(props) {
  return (
    <TouchableOpacity onPress={() => props.onPress()}>
      <Image
        source={require('../assets/images/back.png')}
        style={styles.backIcon}
      />
    </TouchableOpacity>
  );
}
export const styles = StyleSheet.create({
  backIcon: {width: 38, height: 38},
});
