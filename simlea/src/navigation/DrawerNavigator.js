import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {View, Text} from 'react-native';
import {NAVIGATION} from '../constants/navigation';
import MenuView from '../screens/Menu/menuView';
import {EventNavigator} from './EventNavigator';
import AppNavigator from './AppNavigator';
import Home from '../assets/images/home.png';
import {GoBack, HeaderTitle, HeaderButton} from '../components';
import {DraftSave} from '../screens/Draft/component';
import {SettingNavigator} from './SettingNavigator';
import {DashboardNavigator} from './DashboardNavigator';
import {WaitlistNavigator} from './WaitlistNavigator';
import {ActionCreators} from '../redux/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setToken} from '../Utilities/util';
import {DraftNavigator} from './DraftNavigator';
import {AuthNavigator} from './AuthNavigator';
import {EventListView} from '../screens';

const Drawer = createDrawerNavigator();

const DrawerNavigator = props => {
  const [sync, setSync] = useState(true);
  // const handleLogout = () => {
  //   setToken('eventid', '');
  //   setToken('username', '');
  //   setToken('password', '');
  //   setToken('deviceid', '');
  //   setToken('platform', '');
  //   setToken('deviceid', '');
  //   props?.actions?.logoutAction();
  // };
  const toggleOverlaySync = () => {
    setSync(!sync);
  };
  return (
    <Drawer.Navigator
      useLegacyImplementation={false}
      initialRouteName="AuthNavigator"
      drawerContent={props => <MenuView {...props} />}
      screenOptions={({navigation}) => ({
        headerShown: false,
        drawerPosition: 'right',
        title: '',
        drawerStyle: {width: '75%'},
        headerShadowVisible: false,
      })}>
      <Drawer.Screen
        name="AuthNavigator"
        component={AuthNavigator}
        options={({navigation}) => ({
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      />
      <Drawer.Screen
        name="AppNavigator"
        component={AppNavigator}
        options={({navigation}) => ({
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      />
      {/* <Drawer.Screen
        name={NAVIGATION.eventList}
        component={EventNavigator}
        options={({navigation}) => ({
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      /> */}
      <Drawer.Screen
        name={NAVIGATION.settings}
        component={SettingNavigator}
        options={({navigation}) => ({
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
        })}
      />
      <Drawer.Screen
        name={NAVIGATION.waitlist}
        component={AppNavigator}
        initialParams={{screen: 'tab-waitlist'}}
      />
      <Drawer.Screen
        name={NAVIGATION.draft}
        component={AppNavigator}
        initialParams={{screen: 'tab-drafts'}}
      />
      {/* <Drawer.Screen
        name="tab-logout"
        component={EventNavigator}
        options={{
          title: 'Log out',
        }}
        listeners={({navigation}) => ({
          tabPress: () => {
            handleLogout();
            navigation.navigate(NAVIGATION.eventList);
          },
        })}
      /> */}
    </Drawer.Navigator>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(DrawerNavigator);
