/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  CustomTextInput,
  CustomButton,
  CustomTextBox,
} from '../../../components';
import {strings} from '../../../localization/Localization';
import {NAVIGATION} from '../../../constants/navigation';
import Key from '../../../assets/images/forgotPassword.png';
import Back from '../../../assets/images/downIcon.png';
import GlobalStyle from '../../../style/globalstyle';
import {useSelector} from 'react-redux';

export default function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const handleSubmit = () => {
    Alert.alert('Reset link sent to your e-mail.', 'Please Check your inbox.');
  };

  return (
    <View
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <Image source={Key} style={styles.keyImage} />
      <Text
        style={
          themeState?.activeTheme === 'light'
            ? styles.changePasswordTextLight
            : styles.changePasswordText
        }>
        {strings.ForgotPassword.changePassword}
      </Text>
      <Text
        style={
          themeState?.activeTheme === 'light'
            ? styles.paragraphTextLight
            : styles.paragraphText
        }>
        {strings.ForgotPassword.pleaseEnterEmail}
        {'. '}
        {strings.ForgotPassword.resetLink}
        {'. '}
      </Text>
      <CustomTextBox
        style={
          themeState?.activeTheme === 'light'
            ? styles.inputStyleLight
            : styles.inputStyle
        }
        keyboardType="default"
        placeholder={strings.ForgotPassword.enterEmail}
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={
          themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
        }
      />
      <CustomButton
        style={styles.submitBtn}
        labelStyle={styles.actionTitle}
        title={strings.ForgotPassword.getResetLink}
        onPress={() => {
          // handleSubmit();
        }}
      />
      <TouchableOpacity
        onPress={() => props.navigation.navigate(NAVIGATION.login)}
        style={styles.backBox}>
        <Image source={Back} style={styles.backIcon} />
        <Text
          style={
            themeState?.activeTheme === 'light'
              ? styles.emailTextLight
              : styles.emailText
          }>
          {strings.ForgotPassword.backToLogin}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  keyImage: {
    marginTop: 60,
    height: 60,
    width: 60,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  changePasswordText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#FBFBFB',
    textAlign: 'center',
    marginTop: 10,
  },
  changePasswordTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 20,
    textTransform: 'capitalize',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 10,
  },
  paragraphText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 30,
    color: '#FBFBFB',
    marginTop: 10,
    marginBottom: 20,
  },
  paragraphTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 30,
    color: '#1A1A1A',
    marginTop: 10,
    marginBottom: 20,
  },
  emailText: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 14,
    textAlign: 'center',
    color: '#FBFBFB',
    marginLeft: 10,
  },
  emailTextLight: {
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 14,
    textAlign: 'center',
    color: '#1A1A1A',
    marginLeft: 10,
  },
  inputStyle: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 15,
    color: '#fff',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 14,
  },
  inputStyleLight: {
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#8F92A133',
    paddingHorizontal: 15,
    color: '#1a1a1a',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay400,
    fontSize: 14,
  },
  submitBtn: {
    marginTop: 24,
    backgroundColor: '#30C6EA',
    borderRadius: 5,
    width: '100%',
    height: 44,
  },
  actionTitle: {
    color: '#FFFFFF',
    textTransform: 'capitalize',
    fontFamily: GlobalStyle.fontSet.RedHatDisplay700,
    fontSize: 14,
  },
  backBox: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    alignItems: 'center',
  },
  backIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    transform: [{rotate: '90deg'}],
  },
});
