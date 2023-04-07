/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {CustomButton} from '../../../components';
import normalize from 'react-native-normalize';
import GlobalStyle from '../../../style/globalstyle';
import {Modal} from 'react-native-paper';
import * as authAction from '../../../redux/action/authActions';
import {useDispatch} from 'react-redux';

export default function EventDeletePage(props) {
  const dispatch = useDispatch();

  return (
    <Modal
      dismissable={false}
      visible={props.visible}
      onDismiss={props.toggleOverlay}
      contentContainerStyle={styles.addEventContainer}>
      <View>
        <Text style={styles.deleteEventHeaderText}>Delete</Text>
        <Text style={styles.deleteEventText}>
          Do you really want to delete this event?
        </Text>
        <View style={styles.addEventBtn}>
          <View style={styles.spaceBtns}>
            <CustomButton
              style={styles.cancelBtn}
              labelStyle={styles.actionTitle}
              title="Cancel"
              onPress={props.toggleOverlay}
            />
          </View>
          <View style={styles.spaceBtns}>
            <CustomButton
              style={styles.deleteBtn}
              labelStyle={styles.actionTitle}
              title="Delete"
              onPress={() => {
                dispatch(authAction.eventDeleteInNewLoginApi(props?.eventID)),
                  props.toggleDelete();
                dispatch(authAction.deleteEventActionForNewLogin());
              }}
              // onPress={() => props.handleEventDelete(props?.eventID)}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  addEventContainer: {
    width: '70%',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingHorizontal: 17,
    paddingVertical: 25,
  },
  deleteEventHeaderText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 14,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 15,
  },
  deleteEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 14 : 12,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 15,
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
    flexBasis: Platform.isPad === true ? '40%' : '45%',
  },
  cancelBtn: {
    backgroundColor: '#1A1A1A',
    borderRadius: 4,
    width: '100%',
    height: Platform.isPad === true ? 61 : 35,
  },
  deleteBtn: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: Platform.isPad === true ? 61 : 35,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 16 : 10,
    lineHeight: Platform.isPad === true ? 20 : Platform.OS === 'ios' ? 0 : 15,
  },
});
