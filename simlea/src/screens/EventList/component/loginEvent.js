/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, Image, Text, StyleSheet, Platform} from 'react-native';
import {CustomTextInput, CustomButton} from '../../../components';
import GlobalStyle from '../../../style/globalstyle';
import {Modal} from 'react-native-paper';

export function LoginEvent(props) {
  const [error, setError] = useState(' ');
  const handleSubmit = () => {
    if (!props.userName.trim() && !props.passWord.trim()) {
      setError('Please fill both fields');
    } else {
      props.handleLogin();
      setError('');
      props.setUsername('');
      props.setPassword('');
    }
  };
  return (
    <Modal
      dismissable={false}
      visible={props.visible}
      onDismiss={props.toggleOverlay}
      contentContainerStyle={styles.addEventContainer}>
      <View style={styles.eventImageBox}>
        <Image
          source={require('../../../assets/images/login.png')}
          style={styles.loginImage}
        />
      </View>
      <Text style={styles.addEventText}>Login</Text>
      {<Text style={styles.errorText}>{error}</Text>}
      <CustomTextInput
        style={styles.addEventInput}
        keyboardType="default"
        placeholder="Username"
        onChangeText={props.setUsername}
      />
      <CustomTextInput
        style={styles.addEventInput}
        keyboardType="default"
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={props.setPassword}
      />
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
            style={styles.confirmBtn}
            labelStyle={styles.actionTitle}
            title="Login"
            onPress={() => {
              handleSubmit();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  addEventContainer: {
    width: Platform.isPad === true ? '70%' : '80%',
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
  loginImage: {
    height: Platform.isPad === true ? 67 : 38,
    width: Platform.isPad === true ? 63 : 36,
  },
  addEventText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: Platform.isPad === true ? 24 : 16,
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
    fontSize: Platform.isPad === true ? 14 : 12,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 5,
  },
  addEventInput: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: Platform.isPad === true ? 16 : 10,
    height: Platform.isPad === true ? 57 : 32,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    width: '100%',
    borderRadius: 4,
    marginBottom: 8,
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
    flexBasis: Platform.isPad === true ? '42%' : '45%',
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
    marginTop: Platform.isPad === true ? 18 : 10,
  },
});
