import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {CustomButton} from '../../../components';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';

export default function EmptyEventPage(props) {
  return (
    <View
      style={[
        styles.addEventContainer,
        props.theme.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <Text
        style={[
          styles.addEventText,
          props.theme.activeTheme === 'light'
            ? GlobalStyle.lightTheme
            : GlobalStyle.darkTheme,
        ]}>
        There are no events in the list yet..
      </Text>
      <View style={styles.buttonStyle}>
        {/* <CustomButton
          style={styles.addBtn}
          icon={require('../../../assets/images/add-record.png')}
          labelStyle={styles.actionTitle}
          title="Add"
          onPress={() => props.showAddEvent()}
        /> */}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  addEventContainer: {
    marginLeft: Platform.isPad === true ? 24 : 15,
    backgroundColor: '#262626',
  },
  addEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
    marginTop: 20,
    marginBottom: 20,
    color: '#FFFFFF',
  },

  addBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: 6,
    width: '30%',
    borderRadius: 6,
    paddingHorizontal: Platform.isPad === true ? 10 : 0,
    paddingVertical: Platform.isPad === true ? 8 : 0,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 18 : 14,
  },
});
