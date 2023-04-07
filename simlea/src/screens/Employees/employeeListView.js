/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {Alert, FlatList, SafeAreaView, View, Text} from 'react-native';
import {EmployeeListItem} from './component';
import User from '../../assets/images/user.png';
import {styles} from './employeeList.style';
import {NAVIGATION} from '../../constants/navigation';
import {HeaderButton} from '../../components';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../redux/action';
import GlobalStyle from '../../style/globalstyle';

const EmployeeListView = props => {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );
  const employeeState = useSelector(state => state.rootReducers?.employeeState);
  const [employeeData, setEmployeeData] = useState([]);
  const authState = useSelector(state => state.rootReducers?.authState);
  const eventState = useSelector(state => state.rootReducers?.eventState);

  useEffect(() => {
    props?.actions?.employeeAction(eventState.activeEventId);
  }, []);

  useEffect(() => {
    if (employeeState?.employeeList?.data?.list) {
      setEmployeeData(employeeState?.employeeList?.data?.list);
    }
  }, [employeeState.employeeList]);

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerBackVisible: false,
      headerLeft: () => <HeaderButton source={User} />,
    });
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <FlatList
        data={employeeData}
        renderItem={({item}) => (
          <EmployeeListItem
            theme={themeState}
            item={item}
            onPress={() =>
              props.navigation.navigate(NAVIGATION.employeeDetails, {
                data: item,
              })
            }
          />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(EmployeeListView);
