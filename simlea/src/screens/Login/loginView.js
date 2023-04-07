/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  Platform,
  SafeAreaView,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import {CustomButton, CustomTextBox} from '../../components';
import {Switch} from 'react-native-paper';
import {NAVIGATION} from '../../constants';
import {styles} from './login.style';
import {strings} from '../../localization/Localization';
import GlobalStyle from '../../style/globalstyle';
import Eye from '../../assets/images/eyeLight.png';
import {DotIndicator} from 'react-native-indicators';
import EyeLight from '../../assets/images/eyeDark.png';
import EyeCross from '../../assets/images/eyeCrossDark.png';
import EyeLightCross from '../../assets/images/eyeCrossLight.png';
import * as appComponentAction from '../../redux/action/appComponentAction';
import * as authAction from '../../redux/action/authActions';
import {connect, useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../redux/action';

const LoginView = props => {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const dispatch = useDispatch();
  // const eventState = useSelector(state => state.rootReducers?.eventState);
  const authState = useSelector(state => state.rootReducers?.authState);
  const [eventId, setEventId] = useState([]);
  const [error, setError] = useState(' ');
  const [userName, setUserName] = useState('');
  const [clientNumber, setClientNumber] = useState('');
  const [passWord, setPassword] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const handleSubmit = () => {
    if (!userName.trim() && !passWord.trim() && !clientNumber.trim()) {
      setError('Please fill all the fields');
    } else {
      handleLogin();
      {
        isSwitchOn != true &&
          (setUserName(''), setClientNumber(''), setPassword(''));
      }
    }
  };
  console.log('authState?.signIn?.data?.eventId', authState?.signIn?.data);
  useEffect(() => {
    if (authState?.signIn?.data) {
      setEventId(authState?.signIn?.data?.events);
      props.navigation.navigate('EventNavigator');
      setLoading(false);
    }
  }, [authState.signIn]);

  const handleLogin = async () => {
    let obj = {
      username: userName,
      password: passWord,
      customerid: clientNumber,
    };

    dispatch(authAction.loginAction(obj, onError));

    setLoading(true);
  };
  const onError = data => {
    Alert.alert(strings.common.login, 'The access data is not valid');
    setLoading(false);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <Text
        style={[
          styles.loginHeadText,
          themeState.activeTheme === 'light'
            ? GlobalStyle.lightTheme
            : GlobalStyle.darkTheme,
        ]}>
        {strings.Login.loginToYourAccount}
      </Text>
      <Text style={styles.errorText}>{error}</Text>
      <CustomTextBox
        style={
          themeState?.activeTheme === 'light'
            ? styles.inputStyleLight
            : styles.inputStyle
        }
        keyboardType="default"
        placeholder={strings.Login.userName}
        value={isSwitchOn === 'true' ? userName : userName}
        onChangeText={setUserName}
        placeholderTextColor={
          themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
        }
      />
      <CustomTextBox
        style={
          themeState?.activeTheme === 'light'
            ? styles.inputStyleLight
            : styles.inputStyle
        }
        keyboardType="number-pad"
        placeholder={strings.Login.clientNumber}
        value={isSwitchOn === 'true' ? clientNumber : clientNumber}
        onChangeText={setClientNumber}
        placeholderTextColor={
          themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
        }
      />
      <View style={styles.passwordBox}>
        <CustomTextBox
          style={
            themeState?.activeTheme === 'light'
              ? styles.inputStyleLight
              : styles.inputStyle
          }
          keyboardType="default"
          placeholder={strings.Login.password}
          secureTextEntry={passwordVisibility}
          value={isSwitchOn === 'true' ? passWord : passWord}
          onChangeText={setPassword}
          placeholderTextColor={
            themeState?.activeTheme === 'light' ? '#1a1a1a' : '#fff'
          }
        />
        <TouchableOpacity
          onPress={() => setPasswordVisibility(!passwordVisibility)}
          style={styles.eyeBox}>
          {!passwordVisibility ? (
            <Image
              source={themeState?.activeTheme === 'light' ? EyeLight : Eye}
              style={styles.eyeIcon}
            />
          ) : (
            <Image
              source={
                themeState?.activeTheme === 'light' ? EyeLightCross : EyeCross
              }
              style={styles.eyeIcon}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRemember}>
        <View style={styles.toggleBox}>
          <Switch
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
            color="#30C6EA"
          />
          <Text
            style={[
              styles.toggleTextRem,
              themeState.activeTheme === 'light'
                ? GlobalStyle.lightTheme
                : GlobalStyle.darkTheme,
            ]}>
            {strings.Login.rememberMe}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate(NAVIGATION.forgotPassword)}>
          <Text style={styles.toggleTextForgot}>
            {strings.Login.forgotPassword}
          </Text>
        </TouchableOpacity>
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
      <View style={styles.themeBox}>
        <Text
          style={[
            styles.themeText,
            themeState.activeTheme === 'light'
              ? GlobalStyle.lightTheme
              : GlobalStyle.darkTheme,
          ]}>
          LIGHT
        </Text>
        <Switch
          value={themeState.activeTheme === 'light' ? false : true}
          onValueChange={() => dispatch(appComponentAction.toggleTheme())}
          color="#30C6EA"
          style={styles.switchBox}
        />
        <Text
          style={[
            styles.themeText,
            themeState.activeTheme === 'light'
              ? GlobalStyle.lightTheme
              : GlobalStyle.darkTheme,
          ]}>
          DARK
        </Text>
      </View>
      {loading ? (
        <View style={styles.loading}>
          <DotIndicator
            animating={loading}
            color="#30C6EA"
            size={Platform.isPad === true ? 14 : 12}
            hidesWhenStopped={true}
          />
        </View>
      ) : (
        ''
      )}
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(LoginView);
