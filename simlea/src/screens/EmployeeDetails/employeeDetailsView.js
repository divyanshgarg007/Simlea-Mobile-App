/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import {EmployeeDetailsItem, CalenderView, AddCalenderEvent} from './component';
import {styles} from './employeeDetails.style';
import {useSelector} from 'react-redux';
import {CustomButton} from '../../components';
import GlobalStyle from '../../style/globalstyle';

export default function EmployeeDetailsView(props) {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const [employeeData, setEmployeeData] = useState(props?.route?.params?.data);
  const [visibleEvent, setVisibleEvent] = useState(false);
  const authState = useSelector(state => state.rootReducers?.authState);

  useEffect(() => {
    props?.actions?.employeeAction(authState?.event);
  }, []);

  const toggleEvent = () => {
    setVisibleEvent(!visibleEvent);
  };
  const handleCalender = value => {
    // console.log(value)
    let arr = value;
    toggleEvent();
    return arr;
  };

  return (
    <SafeAreaView
      style={
        (styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme)
      }>
      <EmployeeDetailsItem item={employeeData} theme={themeState} />
      <CalenderView
        theme={themeState}
        visible={visibleEvent}
        toggleOverlay={toggleEvent}
        onPress={toggleEvent}
        handleCalender={handleCalender}
      />
      <AddCalenderEvent
        theme={themeState}
        toggleOverlay={toggleEvent}
        visible={visibleEvent}
        onPress={handleCalender}
      />
    </SafeAreaView>
  );
}
