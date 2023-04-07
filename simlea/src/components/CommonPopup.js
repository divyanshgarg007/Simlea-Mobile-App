import React, {useState} from 'react';
import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import normalize from 'react-native-normalize';
import GlobalStyle from '../style/globalstyle';
import CustomButton from './CustomButton';
import Close from '../assets/images/closes.png';
import {Modal} from 'react-native';
import {Dimensions} from 'react-native';

export default function CommonPopup(props) {
  return props.visible == true ? (
    <View
      style={{
        backgroundColor: 'rgba(208, 211, 212,0.7 )',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
        position: 'absolute',
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        onRequestClose={() => {
          props.toggleOverlay();
        }}>
        <View style={styles.modal}>
          <View style={styles.container}>
            <Text style={styles.titleText}>{props.title}</Text>
            <View style={styles.buttonGroup}>
              <View style={styles.spaceBtns}>
                <CustomButton
                  style={styles.saveButton}
                  title="Ok"
                  labelStyle={styles.actionTitle}
                  onPress={() => [props.handle(), props.toggleOverlay()]}
                />
              </View>
              <View style={styles.spaceBtns}>
                <CustomButton
                  style={styles.cancelButton}
                  title="Cancel"
                  labelStyle={styles.actionTitle}
                  onPress={() => props.toggleOverlay()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  ) : (
    ''
  );
}

export const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    paddingHorizontal: 15,
    paddingVertical: 25,
    position: 'relative',
  },

  titleText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 14,
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },

  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  spaceBtns: {
    flex: 0,
    flexBasis: '48%',
  },
  saveButton: {
    backgroundColor: '#30C6EA',
    borderRadius: 4,
    width: '100%',
    height: 35,
    zIndex: 11111,
  },
  cancelButton: {
    borderRadius: 4,
    backgroundColor: '#4B4D54',
    width: '100%',
    height: 35,
    zIndex: 11111,
  },
  actionTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 10,
    lineHeight: Platform.OS === 'ios' ? 0 : 15,
  },
});
