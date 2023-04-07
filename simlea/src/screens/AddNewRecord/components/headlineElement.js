import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {useSelector} from 'react-redux';

export default function HeadlineElement(props) {
  const formReducer = useSelector(state => state.rootReducers.formReducer);

  return (
    <View style={styles.mainView}>
      <Text
        style={{
          fontSize: Platform.isPad === true ? 28 : 20,
          lineHeight: Platform.isPad === true ? 20 : 15,
          color: '#4B4D54',
        }}>
        headline element
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
  },
});
