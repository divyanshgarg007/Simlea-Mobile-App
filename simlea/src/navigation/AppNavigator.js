import React, {useEffect, useState, useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Platform,
  TouchableOpacity,
  Modal,
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native';
import tick from '../assets/images/tick.png';
import Syn from '../assets/images/sync.png';
import {useFocusEffect} from '@react-navigation/native';
import {ActionCreators} from '../redux/action';
import TAB_DASHBOARD from '../assets/images/tab-dashboard.png';
import TAB_WAITLIST from '../assets/images/tab-waitlist.png';
import TAB_DRAFTS from '../assets/images/tab-draft.png';
import TAB_EMPLOYEES from '../assets/images/tab-employees.png';
import TAB_SYNC from '../assets/images/tab-sync.png';
import TAB_LOGOUT from '../assets/images/tab-logout.png';
import * as syncService from '../database/SyncService';
import {DashboardView, EventListView, WaitListView} from '../screens';
import {EventNavigator} from './EventNavigator';
import {WaitlistNavigator} from './WaitlistNavigator';
import {DashboardNavigator} from './DashboardNavigator';
import {EmployeeNavigator} from './EmployeeNavigator';
import normalize from 'react-native-normalize';
import GlobalStyle from '../style/globalstyle';
import {TabNavigatorIcons, SyncModal} from '../components';
import {NAVIGATION} from '../constants';
import {bindActionCreators} from 'redux';
import {connect, useSelector, useDispatch} from 'react-redux';
import {setToken} from '../Utilities/util';
import {AuthNavigator} from './AuthNavigator';
import {DraftNavigator} from './DraftNavigator';
import {APLLICATION_RECORD} from '../database/Constants';
import * as formAction from '../redux/action/formAction';
import * as formDao from '../database/Tables/formDao';
import * as eventAction from '../redux/action/eventActions';
import {DraftSave} from '../screens/Draft/component';

const Tab = createBottomTabNavigator();

const AppNavigator = props => {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const authState = useSelector(state => state.rootReducers?.authState);
  const dispatchh = useDispatch();
  const handleLogout = () => {
    setToken('eventid', '');
    setToken('username', '');
    setToken('password', '');
    setToken('deviceid', '');
    setToken('platform', '');
    setToken('deviceid', '');
    props?.actions?.logoutAction();
  };

  const [count, setCount] = useState(0);
  const [syncProgress, setSyncProgress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(null);
  async function loadDataOnlyOnce() {
    setSyncProgress(true);
    setLoadingMsg('Synchronizing...');
    syncService.initialStateSyncService.serverTimestamp = 0;
    syncService.initialStateSyncService.syncStart = new Date().getTime();
    syncService.initialStateSyncService.syncTimings = [];
    // You can await here
    const response = await syncService.gatherAllFormData();
    //console.log('gatherAllFormData');
    const response1 = await syncService.submitFormDataAction(response);
    console.log('submitFormDataAction');

    const response2 = await syncService.submitImagesNew(response);
    console.log('submitImagesNew');
    const response3 = await syncService.getRemoteForms();
    console.log('getRemoteForms');

    const response4 = await syncService.getRecordsFromServer();
    console.log('getRecordsFromServer front end');

    const response5 = await syncService.getEmployeeData();
    console.log('getEmployeeData');

    const responese5 = await syncService.getFormListTile();

    console.log('getFormListTile');
    setLoadingMsg('Synchronizing ');
    dispatchh(eventAction.eventFormListSuccess(responese5));
  }
  ///Set Count for draft data bubble
  useEffect(() => {
    fetchDraftData();
  }, []);

  async function fetchDraftData() {
    await formDao.getDataListDrafts1().then(items => {
      setCount(items.length);
    });
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={({route, navigation}) => ({
          tabBarStyle: {
            backgroundColor:
              themeState?.activeTheme === 'light' ? '#FBFBFB' : '#000',
            height:
              Platform.isPad === true ? 200 : Platform.OS === 'ios' ? 120 : 90,
            paddingVertical: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },

          cardStyle: {flex: 1},
          tabBarShowLabel: true,
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            // You can return any component that you like here!
            var iconName;

            if (route.name === 'tab-dashboard') {
              iconName = TAB_DASHBOARD;
              return (
                <TabNavigatorIcons
                  backgroundColor={{backgroundColor: color}}
                  source={iconName}
                />
              );
            } else if (route.name === 'tab-waitlist') {
              iconName = TAB_WAITLIST;
              return (
                <TabNavigatorIcons
                  backgroundColor={{backgroundColor: color}}
                  source={iconName}
                />
              );
            } else if (route.name === 'tab-drafts') {
              iconName = TAB_DRAFTS;
              return (
                <TabNavigatorIcons
                  backgroundColor={{backgroundColor: color}}
                  source={iconName}
                />
              );
            } else if (route.name === 'tab-employees') {
              iconName = TAB_EMPLOYEES;
              return (
                <TabNavigatorIcons
                  backgroundColor={{backgroundColor: color}}
                  source={iconName}
                />
              );
            } else if (route.name === 'tab-sync') {
              iconName = TAB_SYNC;
              return (
                <TabNavigatorIcons
                  backgroundColor={{backgroundColor: color}}
                  source={iconName}
                />
              );
            } else if (route.name === 'tab-logout') {
              iconName = TAB_LOGOUT;
              return (
                <TabNavigatorIcons
                  backgroundColor={{backgroundColor: color}}
                  source={iconName}
                />
              );
            }
          },
          tabBarActiveTintColor: '#30C6EA',
          tabBarInactiveTintColor: '#4B4D54',
          tabBarLabelStyle: {
            color: themeState?.activeTheme === 'light' ? '#1a1a1a' : '#FBFBFB',
            fontSize: Platform.isPad === true ? 16 : 12,
            fontFamily: GlobalStyle.fontSet.RedHatDisplay600,
            marginBottom: Platform.isPad === true ? 14 : 0,
          },
        })}>
        <Tab.Screen
          name="tab-dashboard"
          component={DashboardNavigator}
          options={{
            title: 'Dashboard',
          }}
        />
        {authState?.signIn?.data?.modules == 'teamwork' && (
          <Tab.Screen
            name="tab-waitlist"
            component={WaitlistNavigator}
            options={{
              title: 'Waitlist',
              tabBarVisible: false,
            }}
          />
        )}
        <Tab.Screen
          name="tab-drafts"
          component={DraftNavigator}
          options={{
            tabBarVisible: false,
            title: 'Drafts',
            tabBarBadge: count,
          }}
        />
        <Tab.Screen
          name="tab-employees"
          component={EmployeeNavigator}
          options={{
            title: 'Employees',
          }}
        />
        <Tab.Screen
          name="tab-sync"
          component={DashboardNavigator}
          options={{
            title: 'Sync',
          }}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              if (syncProgress === false) {
                loadDataOnlyOnce();
              }
              navigation.navigate('tab-dashboard', {
                screen: 'DashboardNavigator',
              });
            },
          })}
        />
        <Tab.Screen
          name="tab-logout"
          component={DashboardNavigator}
          options={{
            title: 'Log out',
          }}
          listeners={({navigation}) => ({
            tabPress: e => {
              e.preventDefault();
              handleLogout();
              navigation.navigate(NAVIGATION.login);
            },
          })}
        />
      </Tab.Navigator>

      {syncProgress === true && (
        <SyncModal
          loadingMsg={loadingMsg}
          setLoadingMsg={setLoadingMsg}
          load={syncProgress}
          setSyncFlag={setSyncProgress}
        />
      )}
    </>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(AppNavigator);
