import React, {useState} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import normalize from 'react-native-normalize';
import GlobalStyle from '../style/globalstyle';
import CustomButton from './CustomButton';
import tick from '../assets/images/tick.png';
// import Syn from '../assets/images/sync.png';
import Close from '../assets/images/closes.png';
import {Modal} from 'react-native-paper';
import {BallIndicator} from 'react-native-indicators';

export default function SyncModal(props) {
  return (
    <Modal
      visible={props.load}
      onDismiss={props.toggleOverlay}
      contentContainerStyle={styles.container}>
      <View style={styles.syncImageBox}>
        {props.loadingMsg == 'Synchronizing...' ? (
          <BallIndicator
            animating={props.load}
            color="#30C6EA"
            size={38}
            hidesWhenStopped={true}
          />
        ) : (
          <Image source={tick} style={styles.syncImage} />
        )}
      </View>
      <Text style={styles.syncTitleText}>{props.loadingMsg}</Text>
      {props.loadingMsg != 'Synchronizing...' ? (
        <View>
          <Text style={styles.syncText}>Process completed successfully</Text>
          <CustomButton
            style={styles.okButton}
            title="OK"
            labelStyle={styles.buttonTitle}
            onPress={() => [
              props.setSyncFlag(!props.load),
              props.setLoadingMsg(''),
            ]}
          />
        </View>
      ) : (
        ''
      )}
    </Modal>
  );
}

export const styles = StyleSheet.create({
  container: {
    width: '70%',
    backgroundColor: '#FBFBFB',
    borderRadius: 6,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 25,
  },
  syncImageBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 25,
    marginBottom: 16,
  },
  syncImage: {
    height: 39,
    width: 32,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  syncTitleText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 24 : 16,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: Platform.isPad === true ? 25 : 10,
  },
  syncText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 16 : 12,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: Platform.isPad === true ? 10 : 5,
  },
  // spaceBtns: {
  //   flex: 0,
  //   flexBasis: '45%',
  // },
  okButton: {
    backgroundColor: '#30C6EA',
    borderRadius: Platform.isPad === true ? 6 : 4,
    width: '100%',
    alignSelf: 'center',
    marginTop: Platform.OS === 'ios' ? 5 : 16,
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
    height: Platform.isPad === true ? 63 : 47,
  },
  buttonTitle: {
    color: '#FBFBFB',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 20 : 16,
    lineHeight: Platform.isPad === true ? 21 : Platform.OS === 'ios' ? 0 : 15,
    marginTop: Platform.isPad === true ? 20 : 12,
  },

  closeBox: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  closeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
