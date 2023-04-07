/* eslint-disable prettier/prettier */
import React, {useCallback, useEffect, useState} from 'react';
import {Alert, FlatList, SafeAreaView, View, Text} from 'react-native';
import {DraftEmployeeListItem, DraftSave} from './component';
import User from '../../assets/images/user.png';
import {styles} from './draftEmployeeList.style';
import {NAVIGATION} from '../../constants/navigation';
import {HeaderButton, CustomButton} from '../../components';
import {connect, useSelector, useDispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../../redux/action';
import * as formAction from '../../redux/action/formAction';
import GlobalStyle from '../../style/globalstyle';
import {useFocusEffect} from '@react-navigation/native';
import * as formDao from '../../database/Tables/formDao';
import {APLLICATION_RECORD} from '../../database/Constants';

const DraftEmployeeListView = props => {
  const themeState = useSelector(
    state => state.rootReducers?.appComponentReducer,
  );

  const [employeeData, setEmployeeData] = useState([]);
  const [draftData, setDraftData] = useState([]);
  const [click, setClick] = useState();
  const dispatch = useDispatch();

  const authState = useSelector(state => state.rootReducers?.authState);
  // const Data = [
  //   {
  //     id: 1,
  //     leadid: 'ts2-GEW-20-0009',
  //     formName: 'Gew Form',
  //   },
  // ];

  useFocusEffect(
    useCallback(() => {
      fetchDraftData();
    }, []),
  );

  console.log('this is draft');
  async function fetchDraftData() {
    await formDao.getDataListDrafts1().then(items => {
      console.log(items, 'drafts');
      setDraftData(items);
    });
  }

  const draftclick = async items => {
    const form = await formDao.getFormByRemoteId(items.remoteId);
    if (form) {
      props.navigation.navigate(NAVIGATION.editForm, {
        data: form,
        item: items,
      });
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        themeState?.activeTheme === 'light'
          ? GlobalStyle.lightTheme
          : GlobalStyle.darkTheme,
      ]}>
      <FlatList
        data={draftData}
        renderItem={({item}) => (
          <DraftSave
            theme={themeState}
            item={item}
            onPress={() => draftclick(item)}
          />
        )}
        keyExtractor={item => item.id}
      />
      {/* <View style={styles.buttonGroup}>
        <View style={styles.spaceBtns}>
          <CustomButton
            style={styles.saveButton}
            title="Save & Close"
            labelStyle={styles.actionTitle}
            onPress={() => {
              props.navigation.goBack(),
                dispatch(formAction.formSubmitClickMethod());
            }}
          />
        </View>
        <View style={styles.spaceBtns}>
          <CustomButton
            style={styles.saveButton}
            title="Save"
            labelStyle={styles.actionTitle}
            onPress={() => {
              props.navigation.navigate(NAVIGATION.draftSave, {data: Data}),
                dispatch(formAction.formSubmitClickMethod());
            }}
          />
        </View>
        <View style={styles.spaceBtns}>
          <CustomButton
            style={styles.cancelButton}
            title="Cancel"
            labelStyle={styles.actionTitle}
            onPress={() => props.navigation.goBack()}
          />
        </View>
      </View> */}
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(ActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(DraftEmployeeListView);
