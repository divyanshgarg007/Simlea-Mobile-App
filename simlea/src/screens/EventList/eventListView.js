import React, {useState, useEffect} from 'react';
import {
  Animated,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  View,
  Text,
  TouchableHighlight,
  Platform,
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import {
  EventListItem,
  AddEvent,
  LoginEvent,
  EmptyEventPage,
  EventDeletePage,
} from './component';
import Logo from './component/Logo';
import EventList from '../../assets/images/add.png';
import { styles } from './eventList.style';
import { connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/action';
import { CustomButton, HeaderButton } from '../../components';
import { IconButton } from 'react-native-paper';
import { DotIndicator } from 'react-native-indicators';
import { setToken } from '../../Utilities/util';
import { NAVIGATION } from '../../constants';
import { strings } from '../../localization/Localization';
import GlobalStyle from '../../style/globalstyle';

import * as userDao from '../../database/Tables/userDao';
import { DATABASE } from '../../database/Constants';
import { useDispatch } from 'react-redux';
import { APLLICATION_RECORD } from '../../database/Constants';

const EventListView = props => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.rootReducers?.authState);
  const [visible, setVisible] = useState(false);
  const [visibleLogin, setVisibleLogin] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [eventCode, setEventCode] = useState('');
  const [eventId, setEventId] = useState('');
  const [userName, setUsername] = useState('');
  const [passWord, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(' ');
  const [visibleDelete, setVisibleDelete] = useState(false);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [selectedEvent, setSelectedEvent] = useState('');
  console.log("this is event list view");
  const toggleDelete = dataItem => {
    setVisibleDelete(!visibleDelete);
  };
  const hideLogin = () => {
    setVisibleLogin(false);
  };
  const hideAddEvent = dataItem => {
    setVisible(false);
  };
  const showAddEvent = dataItem => {
    setVisible(true);
  };
  const eventMethod = item => {
    setEventId(item);
  };
  const toggleOverlayLogin = () => {
    setVisibleLogin(!visibleLogin);
  };

  // useEffect(() => {
  //   if (eventData) {
  //     setEventList(eventData);
  //     hideAddEvent();
  //     setEventCode('');
  //     setLoading(false);
  //   }
  // }, [eventData]);
  //   if (eventState?.eventList?.data) {
  //     setEventList(eventState?.eventList?.data);
  //     setEventCode('');
  //     setLoading(false);
  //   }
  // }, [eventState.eventList]);

  useEffect(() => {
    if (authState?.signIn?.data) {
      setEventData(authState?.signIn?.data?.events);
      setLoading(false);
    }
  }, [authState.signIn]);

  // const onErrorEvent = data => {
  //   Alert.alert(strings.common.addEvent, 'Activation code is invalid');
  //   setLoading(false);
  // };

  // async function handleCheckEvent() {
  //   let obj = {
  //     code: eventCode,
  //     deviceid: 'O6FVyfCy7dHHdaWm',
  //   };

  //   if (eventCode?.length > 0) {
  //     setLoading(true);
  //     hideAddEvent();

  //     let flagForEventAddProgress = await props?.actions?.checkEventAction(
  //       obj,
  //       onErrorEvent,
  //     );
  //     //  console.log(flagForEventAddProgress);
  //     if (flagForEventAddProgress) {
  //       //setLoading(false);
  //       //toggleOverlay();
  //     } else {
  //       Alert.alert(strings.common.addEvent, 'Activation code is invalid');
  //       hideAddEvent();
  //       setLoading(false);
  //     }
  //     // flagForEventAddProgress.then(function (finalResult) {
  //     //   console.log(finalResult);
  //     //   setLoading(false);
  //     //   toggleOverlay();
  //     // })
  //     //   .catch(function (error) {
  //     //     console.log(error);
  //     //     setLoading(false);
  //     //     toggleOverlay();
  //     //   });
  //   } else {
  //     Alert.alert(strings.common.addEvent, 'Activation code is invalid');
  //     hideAddEvent();
  //     setLoading(false);
  //   }
  // }

  // const onError = data => {
  //   Alert.alert(strings.common.login, 'The access data is not valid');
  //   setLoading(false);
  // };

  // const handleLogin = async () => {
  //   let obj = {
  //     eventid: eventId,
  //     username: userName,
  //     password: passWord,
  //     deviceid: 'O6FVyfCy7dHHdaWm',
  //     platform: 'android',
  //     pushtoken:
  //       'd_Xwhzhz8d8:APA91bEzJA0JR26T1aWfRZFJnBIn47PYcTQYFjG491FLPAYmLd22ua5LGKvQuKdeuBDjrLYSCYHlBzdfGY1I98K8D8dZMIVWnFzh3q9SdBO33J6_MX_ILsYJ3_DjAipGiJ0tbwNrKoL5',
  //   };

  //   const response = await userDao.getUserByEventAndName(eventId, userName);
  //   if (response === null) {
  //     // not stored locally ... get from server
  //     props?.actions?.loginAction(obj, onError, eventId);
  //   } else {
  //     let network = DATABASE.NETWORK_CONNECTION;
  //     // check password or check with server and update record
  //     {
  //       props?.actions?.loginActionUpdate(
  //         obj,
  //         onError,
  //         eventId,
  //         network,
  //         response,
  //       );
  //     }
  //   }
  //   setLoading(true);
  // };

  // React.useLayoutEffect(() => {
  //   props.navigation.setOptions({
  //     headerBackVisible: false,
  //     headerLeft: () => (
  //       <HeaderButton onPress={() => showAddEvent()} source={EventList} />
  //     ),
  //   });
  // });

  // const handleEventDelete = id => {
  //   console.log('rrrrrrr', id);
  //   props.actions.deleteEventRequest(id);
  //   toggleDelete();
  // };
  const renderRightActions = (progress, dataItem) => {
    const opacity = progress.interpolate({
      inputRange: [-1, 0],
      outputRange: [1, 1],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.swipedRow}>
        <Animated.View style={[styles.deleteButton, { opacity }]}>
          <CustomButton
            style={styles.deleteButton}
            title={strings.common.delete}
            onPress={() => {
              toggleDelete(), setSelectedEvent(dataItem.eventId);
            }}
            icon={require('../../assets/images/deleteIconButton.png')}
          />
        </Animated.View>
      </View>
    );
  };

  const renderItem = dataItem => (
    <GestureHandlerRootView key={dataItem.eventId}>
      <Swipeable
        renderRightActions={progress => renderRightActions(progress, dataItem)}
        friction={2}>
        <EventListItem
          theme={themeState}
          item={dataItem}
          onPress={() => {
            console.log(dataItem);
            console.log(dataItem.eventId);

            props.navigation.navigate('AppNavigator'),
              props.actions.updateActiveEventId(dataItem.eventId);
            APLLICATION_RECORD.APP_EVENT_ID = dataItem.eventId;
              APLLICATION_RECORD.EVENT = dataItem;
          }}
        />
      </Swipeable>
    </GestureHandlerRootView>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      {eventData && (
        <>
          <FlatList
            data={eventData}
            renderItem={({item}) => renderItem(item)}
            keyExtractor={item => item?.eventId}
          />
          {visible || visibleLogin || Platform.isPad || (
            <Logo theme={themeState} />
          )}
          {/* <AddEvent
            theme={themeState}
            hideAddEvent={hideAddEvent}
            showAddEvent={showAddEvent}
            visible={visible}
            setEventCode={setEventCode}
            handleCheckEvent={handleCheckEvent}
            eventCode={eventCode}
          /> */}
          {/* <LoginEvent
            toggleOverlay={eventMethod}
            visible={visibleLogin}
            handleLogin={handleLogin}
            userName={userName}
            setUsername={setUsername}
            passWord={passWord}
            setPassword={setPassword}
            eventID={eventId}
            setEventID={setEventId}
          /> */}
          <EventDeletePage
            theme={themeState}
            toggleOverlay={toggleDelete}
            visible={visibleDelete}
            toggleDelete={toggleDelete}
            eventID={selectedEvent}
          />
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
        </>
      )}
      {!eventData && (
        <>
          <EmptyEventPage
            hideAddEvent={hideAddEvent}
            showAddEvent={showAddEvent}
            visible={visible}
            theme={themeState}
          />
          {/* <AddEvent
            theme={themeState}
            hideAddEvent={hideAddEvent}
            showAddEvent={showAddEvent}
            visible={visible}
            setEventCode={setEventCode}
            handleCheckEvent={handleCheckEvent}
            eventCode={eventCode}
          /> */}
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
        </>
      )}
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(EventListView);
