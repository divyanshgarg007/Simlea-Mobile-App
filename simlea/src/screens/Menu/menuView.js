import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, Alert, Image} from 'react-native';
import {View, ScrollView} from 'react-native';
import {MenuItem} from './components';
import {Avatar, Switch, Modal} from 'react-native-paper';
import {NAVIGATION} from '../../constants';
import * as appComponentAction from '../../redux/action/appComponentAction';
import * as authStateAction from '../../redux/action/authActions';

import {useSelector, connect, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../redux/action';
import {styles} from './menu.style';
import GlobalStyle from '../../style/globalstyle';
import {setToken} from '../../Utilities/util';
import CustomButton from '../../components/CustomButton';

const MenuView = props => {
  const themeState = useSelector(
    state => state.rootReducers.appComponentReducer,
  );
  const dispatch = useDispatch();
  const authState = useSelector(state => state.rootReducers?.authState);
  const [menu, setMenu] = useState([]);
  const [selectedKey, setSelectedKey] = useState(
    authState?.signIn?.data?.status,
  );
  const [visible, setVisible] = useState(false);

  const openModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const eventAlertMethod = () => {
    Alert.alert(
      'Change Event',
      'You will be redirected to the events list page. Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => props.navigation.navigate(NAVIGATION.eventList),
        },
      ],
    );
  };

  useEffect(() => {
    if (authState?.signIn?.data) {
      let temp = [];
      temp.push(
        {
          id: '1',
          name: 'Dashboard',
        },
        {
          id: '2',
          name: 'Events',
        },
        // {
        //   id: '3',
        //   name: 'Wait list',
        // },
        // {
        //   id: '4',
        //   name: 'Drafts',
        // },
        {
          id: '3',
          name: (
            <View style={styles.themeBox}>
              <Text
                style={[
                  styles.themeText,
                  themeState.activeTheme === 'light'
                    ? GlobalStyle.lightTheme
                    : GlobalStyle.darkTheme,
                ]}>
                Light
              </Text>
              <View style={styles.switchBox}>
                <Switch
                  value={themeState.activeTheme === 'light' ? false : true}
                  onValueChange={() =>
                    dispatch(appComponentAction.toggleTheme())
                  }
                  color="#30C6EA"
                />
              </View>
              <Text
                style={[
                  styles.themeText,
                  themeState.activeTheme === 'light'
                    ? GlobalStyle.lightTheme
                    : GlobalStyle.darkTheme,
                ]}>
                Dark
              </Text>
            </View>
          ),
        },
        {
          id: '4',
          name: 'Log out',
        },
      );
      setMenu(temp);
    } else {
      let initialMenu = [];
      initialMenu.push(
        {
          id: '1',
          name: 'Settings',
        },
        {
          id: '2',
          name: (
            <View style={styles.themeBox}>
              <Text
                style={[
                  styles.themeText,
                  themeState.activeTheme === 'light'
                    ? GlobalStyle.lightTheme
                    : GlobalStyle.darkTheme,
                ]}>
                Light
              </Text>
              <View style={styles.switchBox}>
                <Switch
                  value={themeState.activeTheme === 'light' ? false : true}
                  onValueChange={() =>
                    dispatch(appComponentAction.toggleTheme())
                  }
                  color="#30C6EA"
                />
              </View>
              <Text
                style={[
                  styles.themeText,
                  themeState.activeTheme === 'light'
                    ? GlobalStyle.lightTheme
                    : GlobalStyle.darkTheme,
                ]}>
                Dark
              </Text>
            </View>
          ),
        },
      );
      setMenu(initialMenu);
    }
  }, [authState?.signIn?.data, themeState.activeTheme]);

  const handleMenu = title => {
    if (title === 'Dashboard') {
      props.navigation.navigate(NAVIGATION.dashboard);
    } else if (title === 'Events') {
      eventAlertMethod();
    } else if (title === 'Wait list') {
      props.navigation.navigate(NAVIGATION.waitlist);
    } else if (title === 'Drafts') {
      props.navigation.navigate(NAVIGATION.draft);
    } else if (title === 'Log out') {
      handleLogout();
      props.navigation.navigate(NAVIGATION.login);
    } else if (title === 'Settings') {
      props.navigation.navigate(NAVIGATION.settings);
    }
  };

  const handleLogout = () => {
    setToken('eventid', '');
    setToken('username', '');
    setToken('password', '');
    setToken('deviceid', '');
    setToken('platform', '');
    setToken('deviceid', '');
    props.actions.logoutAction();
  };

  const handleStatus = key => {
    setSelectedKey(key);
  };

  return (
    <SafeAreaView
      style={[
        styles.menuContainer,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <ScrollView>
        <View
          style={authState?.signIn?.data ? styles.userInfo : styles.loginInfo}>
          {authState?.signIn?.data && (
            <>
              <Avatar.Icon size={55} icon="account-outline" color="#30C6EA" />
              {authState?.signIn?.data?.statusOptions && (
                <View
                  style={
                    authState?.signIn?.data?.status === 'available'
                      ? styles.statusBox
                      : authState?.signIn?.data?.status === 'offline'
                      ? styles.statusBoxOffline
                      : styles.statusBoxAway
                  }
                />
              )}
              {!authState?.signIn?.data?.statusOptions && (
                <View
                  style={
                    authState?.signIn?.data?.status === 'offline'
                      ? styles.statusBoxOffline
                      : styles.statusBox
                  }
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  authState?.signIn?.data?.statusOptions && openModal();
                }}>
                <Text
                  style={[
                    styles.userName,
                    themeState.activeTheme === 'light'
                      ? GlobalStyle.lightTheme
                      : GlobalStyle.darkTheme,
                  ]}>
                  {authState?.signIn?.data?.status}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {menu.map((item, index) => (
          <MenuItem
            theme={themeState}
            key={index}
            item={item}
            handleMenu={name => handleMenu(name)}
          />
        ))}
      </ScrollView>
      <Modal
        dismissable={false}
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalContainer}>
        {authState?.signIn?.data?.statusOptions?.map(
          (statusDropdown, index) => (
            <View style={styles.modalTick} key={index}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    authStateAction.updateStatusOfUserInReducer(
                      statusDropdown.value,
                    ),
                  ),
                    hideModal();
                }}>
                <Text>{statusDropdown.label.en}</Text>
              </TouchableOpacity>
              {authState?.signIn?.data?.status == statusDropdown.value && (
                <Image
                  style={styles.checkIcon}
                  source={require('../../assets/images/tick.png')}
                />
              )}
            </View>
          ),
        )}

        <View style={styles.addModalBtn}>
          <View style={styles.spaceBtns}>
            <CustomButton
              style={styles.cancelBtn}
              labelStyle={styles.actionTitle}
              title="Cancel"
              onPress={() => hideModal()}
            />
          </View>
          <View style={styles.spaceBtns}>
            <CustomButton
              loading={true}
              style={styles.confirmBtn}
              labelStyle={styles.actionTitle}
              title="OK"
              onPress={() => {
                handleStatus(selectedKey), hideModal();
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(MenuView);
