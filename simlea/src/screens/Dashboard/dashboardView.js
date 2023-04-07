import React, { useEffect, useState, useCallback } from 'react';
import { Dimensions, SafeAreaView, View, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DotIndicator } from 'react-native-indicators';
import { FlatGrid } from 'react-native-super-grid';
import { DashboardItem } from './component';
import User from '../../assets/images/user.png';
import { styles } from './dashboard.style';
import { NAVIGATION } from '../../constants/navigation';
import { HeaderTestEvent, HeaderButton } from '../../components';
import { useDispatch, connect, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../redux/action';
import { strings } from '../../localization/Localization';
import GlobalStyle from '../../style/globalstyle';
import * as syncService from '../../database/SyncService';
import { APLLICATION_RECORD } from '../../database/Constants';
import * as eventAction from '../../redux/action/eventActions';
import * as formDao from '../../database/Tables/formDao';
import * as DeviceInfo from 'react-native-device-info';
import { getToken } from '../../Utilities/util';

const DashboardView = props => {
  //console.log('DeviceInfo.getDeviceId()', DeviceInfo.getDeviceId());
  const dispatch = useDispatch();

  const eventState = useSelector(state => state.rootReducers?.eventState);
  const authState = useSelector(state => state.rootReducers?.authState);
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [eventFormData, setEventForm] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialState = {
    currentFormsData: [],
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     if (authState.signIn?.data) {
  //       APLLICATION_RECORD.APP_USER_ID = authState.signIn.data.id;
  //       APLLICATION_RECORD.CURRENT_USER = authState.signIn.data;
  //       setEventForm([]);
  //       fetchData();
  //     }
  //   }, [authState.signIn.data]),
  // );
  // useEffect(() => {
  //   console.log("this is event id open");
  //   console.log(eventState.activeEventId);
  //   console.log("this is event id close");
  //   authState.signIn?.data?.events.map((eventData, index) => {
  //     if (eventData.eventId == eventState.activeEventId) {
  //       console.log("its done!!");
  //       APLLICATION_RECORD.EVENT = eventData;
  //     }

  //   })

  //   APLLICATION_RECORD.APP_EVENT_ID = eventState.activeEventId;
  //   APLLICATION_RECORD.APP_USER_ID = authState.signIn.data.id;
  //   APLLICATION_RECORD.CURRENT_USER = authState.signIn.data;
  // }, []);

  useFocusEffect(
    useCallback(() => {
      authState.signIn?.data?.events.map((eventData, index) => {
        if (eventData.eventId == eventState.activeEventId) {
          console.log('its done!!');
          APLLICATION_RECORD.EVENT = eventData;
        }
      });

      APLLICATION_RECORD.APP_EVENT_ID = eventState.activeEventId;
      APLLICATION_RECORD.APP_USER_ID = authState.signIn.data.id;
      APLLICATION_RECORD.CURRENT_USER = authState.signIn.data;
      setEventForm([]);
      fetchData();
    }, []),
  );

  async function fetchData() {
    console.log('fetchDatais called');
    console.log(APLLICATION_RECORD.EVENT);
    if (APLLICATION_RECORD.APP_EVENT_ID && authState.signIn?.data) {
      console.log('fetchData  iiiis called');

      const getFormList = await formDao.getList(
        APLLICATION_RECORD.APP_EVENT_ID,
      );
      console.log(getFormList);
      setTileRecord(getFormList);
      if (!getFormList.length) {
        loadDataOnlyOnce();
      }
    }
  }
  useEffect(() => {
    if (eventState?.eventListFromSQL?.data) {
      var arr = [];
      eventState?.eventListFromSQL?.data?.map(item => {
        arr.push(Object.assign({ ...item }, { type: strings.common.newRecord }));
        arr.push(Object.assign(item, { type: strings.common.list }));
      });

      setEventForm(arr);
    }
  }, [eventState.eventListFromSQL]);

  //console.log('fdvgajk', eventState.eventFormList);
  // useEffect(() => {
  //   if (eventState?.eventFormList?.data) {
  //     var arr = [];
  //    // console.log(eventState);
  //    // console.log(eventState.eventFormList);
  //    // console.log(eventState.eventFormList.data);
  //     eventState?.eventFormList?.data?.map((item) => {
  //       arr.push(Object.assign({ ...item }, { type: strings.common.newRecord }));
  //       arr.push(Object.assign(item, { type: strings.common.list }));
  //     });
  //    setEventForm(arr);
  //   }

  // }, [eventState.eventFormList]);

  async function loadDataOnlyOnce() {
    //console.log('loadDataOnlyOnce');
    syncService.initialStateSyncService.serverTimestamp = 0;
    syncService.initialStateSyncService.syncStart = new Date().getTime();
    syncService.initialStateSyncService.syncTimings = [];
    // You can await here
    setLoading(true);
    const response = await syncService.gatherAllFormData();
    // console.log('gatherAllFormData', response);
    const response1 = await syncService.submitFormDataAction(response);
    //console.log('submitFormDataAction', response1);

    const response2 = await syncService.submitImagesNew(response);
    //console.log('submitImagesNew', response2);
    const response3 = await syncService.getRemoteForms();
    //console.log('getRemoteForms', response3);

    const response4 = await syncService.getRecordsFromServer();
    //console.log('getRecordsFromServer front end', response4);

    const response5 = await syncService.getEmployeeData();
    //console.log('getRecordsFromServer', response5);

    const responese5 = await syncService.getFormListTile();
    //console.log('getFormListTile', responese5);
    dispatch(eventAction.eventFormListSuccess(responese5));

    setTileRecord(responese5);
    setLoading(false);

    //   await syncService.gatherAllFormData()
    //   .then(async data => await syncService.submitFormDataAction(data))
    //  // .then(async () => await syncService.submitImagesNew())
    //   .then(async () => await syncService.getEventInfo())
    //   .then(async () => await syncService.getRemoteForms())
    //   .then(async () => await syncService.getRecordsFromServer(fullSync))
    //   .then(async () => {
    //     const responese5 = await syncService.getFormListTile();
    //    // console.log('getFormListTile', responese5)
    //     setTileRecord(responese5);
    //   })
  }
  function setTileRecord(arrayData) {
    let arr = [];
    console.log(arrayData);
    arrayData.map(item => {
      arr.push(Object.assign({ ...item }, { type: strings.common.newRecord }));
      arr.push(Object.assign(item, { type: strings.common.list }));
    });
    setEventForm(arr);
    getModifiedCounts(arrayData);
  }

  async function getModifiedCounts(forms) {
    let formIds = [];
    forms.forEach(form => formIds.push(form.id));
    let recordofForm =  await syncService.modificationCount(formIds);
    let draftofForm =  await syncService.getModifiedCountsDrafts(formIds);
  }

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => <HeaderButton source={User} />,
    });
  });

  ///Report list on event list click
  const onSuccessReport = data => {
    props.navigation.navigate(NAVIGATION.lists, {
      data: data,
      form: initialState.currentFormsData,
    });
    setLoading(false);
  };
  const onErrorReport = data => { };

  const handleReportList = data => {
    let obj = {
      formid: data?.id,
      eventid: authState?.event,
    };
    props?.actions?.eventReportListAction(obj, onSuccessReport, onErrorReport);
    setLoading(true);
  };

  const navigationCombined = item => {
    //console.log('setEventFormsetEventFormsetEventFormsetEventForm', item);
    APLLICATION_RECORD.FORM = item;
    if (item.type === 'New Record') {
      props.navigation.navigate(NAVIGATION.addNewRecord, { data: item });
    } else {
      initialState.currentFormsData = item;
      // handleReportList();
      props.navigation.navigate(NAVIGATION.lists, {
        form: initialState.currentFormsData,
      });
    }
  };

  return (
    <SafeAreaView
      style={[
        themeState?.activeTheme === 'light'
          ? styles.containerLight
          : styles.containerDark,
      ]}>
      <HeaderTestEvent
        event={authState.signIn?.data?.events.map(eventName =>
          APLLICATION_RECORD.APP_EVENT_ID === eventName.eventId
            ? eventName.name
            : null,
        )}
        theme={themeState}
      />

      <FlatGrid
        itemDimension={Platform.isPad === true ? 210 : 130}
        data={eventFormData}
        spacing={Platform.isPad === true ? 22 : 15}
        style={[styles.flatGridStyle]}
        renderItem={({ item }) => (
          <DashboardItem
            item={item}
            onPress={() => navigationCombined(item)}
            theme={themeState}
          />
        )}
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
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(DashboardView);
