/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import {CustomTextInput, CustomButton} from '../../../components';
import GlobalStyle from '../../../style/globalstyle';
import {Modal} from 'react-native-paper';

export function AddEvent(props) {
  return (
    <Modal
      dismissable={false}
      visible={props.visible}
      onDismiss={props.hideAddEvent}
      contentContainerStyle={styles.addEventContainer}>
      <View style={styles.eventImageBox}>
        <Image
          source={require('../../../assets/images/events.png')}
          style={styles.eventImage}
        />
      </View>
      <Text style={[styles.addEventText]}>Please enter event ID</Text>
      <CustomTextInput
        style={styles.addEventInput}
        keyboardType="default"
        onChangeText={props.setEventCode}
      />
      <View style={styles.addEventBtn}>
        <View style={styles.spaceBtns}>
          <CustomButton
            style={styles.cancelBtn}
            icon={require('../../../assets/images/cancel.png')}
            labelStyle={styles.actionTitle}
            title="Cancel"
            onPress={() => props.hideAddEvent()}
          />
        </View>
        <View style={styles.spaceBtns}>
          <CustomButton
            loading={true}
            contentStyle={styles.contentStyle}
            style={styles.confirmBtn}
            icon={require('../../../assets/images/tick-white.png')}
            labelStyle={styles.actionTitle}
            title="Confirm"
            onPress={() => props.handleCheckEvent()}
          />
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  addEventContainer: {
    width: '80%',
    backgroundColor: '#FBFBFB',
    borderRadius: Platform.isPad === true ? 10 : 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: Platform.isPad === true ? 40 : 17,
    paddingVertical: Platform.isPad === true ? 46 : 25,
  },
  eventImageBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  eventImage: {
    height: Platform.isPad === true ? 70 : 39,
    width: Platform.isPad === true ? 61 : 34,
    resizeMode: 'contain',
  },
  addEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 24 : 14,
    textAlign: 'center',
    color: '#1A1A1A',
    marginTop: 8,
    marginBottom: 15,
  },
  addEventInput: {
    height: Platform.isPad === true ? 57 : 40,
    width: '100%',
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: Platform.isPad === true ? 7 : 4,
  },
  addEventBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.isPad === true ? 37 : 20,
    width: '100%',
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '45%',
  },
  cancelBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 61 : 35,
  },
  confirmBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    height: Platform.isPad === true ? 61 : 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 10,
    lineHeight: Platform.isPad === true ? 20 : Platform.OS === 'ios' ? 0 : 15,
    marginTop: Platform.isPad === true ? 16 : 10,
  },
});
